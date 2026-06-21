import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { Client, ClientSchema } from './schemas/client.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Task, TaskSchema } from './schemas/task.schema';
import { Sprint, SprintSchema } from './schemas/sprint.schema';
import { Team, TeamSchema } from './schemas/team.schema';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { Leave, LeaveSchema } from './schemas/leave.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { SupportTicket, SupportTicketSchema } from './schemas/support-ticket.schema';
import { DocumentFile, DocumentFileSchema } from './schemas/document.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { OtpAttempt, OtpAttemptSchema } from './schemas/otp-attempt.schema';
import { ProjectMilestone, ProjectMilestoneSchema } from './schemas/project-milestone.schema';

export const DATABASE_MODELS = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Employee.name, schema: EmployeeSchema },
  { name: Client.name, schema: ClientSchema },
  { name: Project.name, schema: ProjectSchema },
  { name: Task.name, schema: TaskSchema },
  { name: Sprint.name, schema: SprintSchema },
  { name: Team.name, schema: TeamSchema },
  { name: Attendance.name, schema: AttendanceSchema },
  { name: Leave.name, schema: LeaveSchema },
  { name: Invoice.name, schema: InvoiceSchema },
  { name: Payment.name, schema: PaymentSchema },
  { name: SupportTicket.name, schema: SupportTicketSchema },
  { name: DocumentFile.name, schema: DocumentFileSchema },
  { name: Notification.name, schema: NotificationSchema },
  { name: Message.name, schema: MessageSchema },
  { name: Candidate.name, schema: CandidateSchema },
  { name: AuditLog.name, schema: AuditLogSchema },
  { name: Session.name, schema: SessionSchema },
  { name: OtpAttempt.name, schema: OtpAttemptSchema },
  { name: ProjectMilestone.name, schema: ProjectMilestoneSchema },
]);

@Module({
  imports: [DATABASE_MODELS],
  exports: [DATABASE_MODELS],
})
export class DatabaseModule {}
