import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingWebhookController } from './billing-webhook.controller';
import { Invoice, InvoiceSchema } from '../../database/schemas/invoice.schema';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { Counter, CounterSchema } from '../../database/schemas/counter.schema';
import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { Project, ProjectSchema } from '../../database/schemas/project.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    AuditModule,
  ],
  controllers: [BillingController, BillingWebhookController],
  providers: [BillingService],
  exports: [BillingService]
})
export class BillingModule {}
