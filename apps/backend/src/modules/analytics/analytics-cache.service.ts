import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../../database/schemas/client.schema';
import { Project } from '../../database/schemas/project.schema';
import { ProjectMilestone } from '../../database/schemas/project-milestone.schema';
import { Invoice } from '../../database/schemas/invoice.schema';
import { Payment } from '../../database/schemas/payment.schema';
import { SupportTicket } from '../../database/schemas/support-ticket.schema';
import { Meeting } from '../../database/schemas/meeting.schema';
import { AuditLog } from '../../database/schemas/audit-log.schema';
import { AnalyticsSnapshot, AnalyticsSnapshotDocument } from '../../database/schemas/analytics-snapshot.schema';
import { RiskEngineService } from './risk-engine.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class AnalyticsCacheService {
  private readonly logger = new Logger(AnalyticsCacheService.name);

  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectMilestone.name) private milestoneModel: Model<ProjectMilestone>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicket>,
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    @InjectModel(AnalyticsSnapshot.name) private snapshotModel: Model<AnalyticsSnapshotDocument>,
    private riskEngine: RiskEngineService
  ) {}

  @Cron('*/5 * * * *')
  async refreshSnapshot() {
    this.logger.log('Refreshing Analytics Snapshot...');
    const now = new Date();
    
    // CEO Metrics
    const totalClients = await this.clientModel.countDocuments();
    const activeClients = await this.clientModel.countDocuments({ status: 'ACTIVE' });
    const newClientsThisMonth = await this.clientModel.countDocuments({
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
    });

    const totalProjects = await this.projectModel.countDocuments();
    const activeProjects = await this.projectModel.countDocuments({ status: 'IN_PROGRESS' });
    const delayedProjects = await this.projectModel.countDocuments({ status: 'DELAYED' });

    // Financial
    const payments = await this.paymentModel.find({ status: 'SUCCESS' }).lean();
    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const monthlyRevenue = payments.filter(p => (p.createdAt ? new Date(p.createdAt) : new Date(0)) >= new Date(now.getFullYear(), now.getMonth(), 1)).reduce((acc, p) => acc + (p.amount || 0), 0);
    
    const invoices = await this.invoiceModel.find().lean();
    const totalInvoices = invoices.length;
    const pendingInvoices = invoices.filter(i => i.status === 'PENDING').length;
    const outstandingRevenue = invoices.filter(i => i.status === 'PENDING').reduce((acc, i) => acc + (i.amount || 0), 0);
    const failedPayments = await this.paymentModel.countDocuments({ status: 'FAILED' });

    const openTickets = await this.ticketModel.countDocuments({ status: 'OPEN' });
    const pendingMeetings = await this.meetingModel.countDocuments({ status: 'PENDING' });
    const totalAiQueries = await this.auditLogModel.countDocuments({ action: AuditEvent.AI_QUERY });

    // MD Metrics (Risk Engine Eval)
    let highRiskProjects = 0;
    let openBlockers = await this.ticketModel.countDocuments({ status: 'BLOCKED' });
    
    const allProjects = await this.projectModel.find().lean();
    for (const project of allProjects) {
       const pMilestones = await this.milestoneModel.find({ projectId: project._id }).lean();
       const pTickets = await this.ticketModel.find({ projectId: project._id }).lean();
       const pInvoices = await this.invoiceModel.find({ projectId: project._id }).lean();
       
       const risk = this.riskEngine.calculateProjectRisk(project as any, pMilestones as any, pTickets as any, pInvoices as any);
       if (risk.level === 'HIGH' || risk.level === 'CRITICAL') {
         highRiskProjects++;
       }
       if (risk.needsEscalation) {
         // Fire alert logic here
         this.logger.warn(`Project ${project._id} Escalated! Risk Score: ${risk.score}`);
       }
    }

    // Security Metrics
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const failedLogins24h = await this.auditLogModel.countDocuments({ action: AuditEvent.LOGIN_FAILED, createdAt: { $gte: oneDayAgo } });
    const failedLogins7d = await this.auditLogModel.countDocuments({ action: AuditEvent.LOGIN_FAILED, createdAt: { $gte: sevenDaysAgo } });
    const accountLockEvents = await this.auditLogModel.countDocuments({ action: AuditEvent.ACCOUNT_LOCKED });
    const rbacViolations = await this.auditLogModel.countDocuments({ action: AuditEvent.RBAC_VIOLATION });
    const aiRbacDeniedEvents = await this.auditLogModel.countDocuments({ action: AuditEvent.AI_RBAC_DENIED });

    // Construct Snapshot
    const snapshotData = {
      generatedBy: 'analytics-cache-service',
      generatedAt: now,
      version: 1,
      ceo: {
        totalClients, activeClients, newClientsThisMonth,
        totalProjects, activeProjects, delayedProjects,
        totalRevenue, monthlyRevenue, outstandingRevenue,
        totalInvoices, pendingInvoices, failedPayments,
        openTickets, pendingMeetings, totalAiQueries
      },
      md: {
        projectHealthScore: 85.5, // Mock baseline
        milestoneCompletionPercent: 60.0, // Mock baseline
        highRiskProjects,
        openBlockers
      },
      security: {
        failedLogins24h,
        failedLogins7d,
        accountLockEvents,
        rbacViolations,
        aiRbacDeniedEvents,
        promptInjectionAttempts: 0 // Mocked for phase 6 baseline
      }
    };

    // Upsert single document
    await this.snapshotModel.findOneAndUpdate(
      {}, // Target the single snapshot document
      snapshotData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    this.logger.log('Analytics Snapshot updated successfully.');
  }
}
