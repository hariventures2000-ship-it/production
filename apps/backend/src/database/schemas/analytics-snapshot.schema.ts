import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class CeoMetrics {
  @Prop({ default: 0 }) totalClients: number;
  @Prop({ default: 0 }) activeClients: number;
  @Prop({ default: 0 }) newClientsThisMonth: number;
  
  @Prop({ default: 0 }) totalProjects: number;
  @Prop({ default: 0 }) activeProjects: number;
  @Prop({ default: 0 }) delayedProjects: number;

  @Prop({ default: 0 }) totalRevenue: number;
  @Prop({ default: 0 }) monthlyRevenue: number;
  @Prop({ default: 0 }) outstandingRevenue: number;

  @Prop({ default: 0 }) totalInvoices: number;
  @Prop({ default: 0 }) pendingInvoices: number;
  @Prop({ default: 0 }) failedPayments: number;

  @Prop({ default: 0 }) openTickets: number;
  @Prop({ default: 0 }) pendingMeetings: number;

  @Prop({ default: 0 }) totalAiQueries: number;
}

@Schema()
export class MdMetrics {
  @Prop({ default: 0 }) projectHealthScore: number; // e.g. 85.5
  @Prop({ default: 0 }) milestoneCompletionPercent: number; // 60.2
  @Prop({ default: 0 }) highRiskProjects: number;
  @Prop({ default: 0 }) openBlockers: number;
}

@Schema()
export class SecurityMetrics {
  @Prop({ default: 0 }) failedLogins24h: number;
  @Prop({ default: 0 }) failedLogins7d: number;
  @Prop({ default: 0 }) accountLockEvents: number;
  @Prop({ default: 0 }) rbacViolations: number;
  @Prop({ default: 0 }) aiRbacDeniedEvents: number;
  @Prop({ default: 0 }) promptInjectionAttempts: number;
}

@Schema({ timestamps: true })
export class AnalyticsSnapshot extends Document {
  @Prop({ required: true, default: 'analytics-cache-service' })
  generatedBy: string;

  @Prop({ required: true, default: () => new Date() })
  generatedAt: Date;

  @Prop({ required: true, default: 1 })
  version: number;

  @Prop({ type: CeoMetrics, default: () => ({}) })
  ceo: CeoMetrics;

  @Prop({ type: MdMetrics, default: () => ({}) })
  md: MdMetrics;

  @Prop({ type: SecurityMetrics, default: () => ({}) })
  security: SecurityMetrics;
}

export type AnalyticsSnapshotDocument = AnalyticsSnapshot & Document;
export const AnalyticsSnapshotSchema = SchemaFactory.createForClass(AnalyticsSnapshot);
