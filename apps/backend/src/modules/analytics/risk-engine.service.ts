import { Injectable } from '@nestjs/common';
import { ProjectDocument } from '../../database/schemas/project.schema';
import { InvoiceDocument } from '../../database/schemas/invoice.schema';
import { SupportTicketDocument } from '../../database/schemas/support-ticket.schema';
import { ProjectMilestoneDocument } from '../../database/schemas/project-milestone.schema';

@Injectable()
export class RiskEngineService {
  /**
   * Deterministic Risk Scoring Formula
   * Overdue Milestone = +30
   * Blocked Ticket = +15
   * Overdue Invoice = +20
   * No Update > 14 Days = +25
   */
  calculateProjectRisk(
    project: ProjectDocument,
    milestones: ProjectMilestoneDocument[],
    tickets: SupportTicketDocument[],
    invoices: InvoiceDocument[]
  ): { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; needsEscalation: boolean } {
    let score = 0;
    const now = new Date();

    // 1. Overdue Milestones (+30 each)
    const overdueMilestones = milestones.filter(m => 
      m.status !== 'VERIFIED' && m.targetDate && new Date(m.targetDate) < now
    ).length;
    score += (overdueMilestones * 30);

    // 2. Blocked Tickets (+15 each)
    const blockedTickets = tickets.filter(t => t.status === 'BLOCKED').length;
    score += (blockedTickets * 15);

    // 3. Overdue Invoices (+20 each)
    const overdueInvoices = invoices.filter(i => 
      i.status === 'PENDING' && i.dueDate && new Date(i.dueDate) < now
    ).length;
    score += (overdueInvoices * 20);

    // 4. No Updates > 14 Days (+25)
    const lastUpdate = project.updatedAt ? new Date(project.updatedAt) : (project.createdAt ? new Date(project.createdAt) : new Date());
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 14) {
      score += 25;
    }

    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 81) level = 'CRITICAL';
    else if (score >= 51) level = 'HIGH';
    else if (score >= 21) level = 'MEDIUM';

    // Risk Escalation (Triggers alerts if > 80)
    const needsEscalation = score > 80;

    return { score, level, needsEscalation };
  }
}
