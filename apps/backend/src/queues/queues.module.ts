import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';

// ═══════════════════════════════════════════════════════════════════
// Queues Module — Hariventure Digital Production
// Registers all BullMQ processors. Import this module in AppModule.
// ═══════════════════════════════════════════════════════════════════

@Module({
  imports: [
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [EmailProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
