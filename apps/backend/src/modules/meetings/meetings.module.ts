import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { Meeting, MeetingSchema } from '../../database/schemas/meeting.schema';
import { Counter, CounterSchema } from '../../database/schemas/counter.schema';
import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meeting.name, schema: MeetingSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    AuditModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService]
})
export class MeetingsModule {}
