import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectRequestsService } from './project-requests.service';
import { ProjectRequestsController } from './project-requests.controller';
import { ProjectRequest, ProjectRequestSchema } from '../../database/schemas/project-request.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { Counter, CounterSchema } from '../../database/schemas/counter.schema';
import { BullModule } from '@nestjs/bull';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectRequest.name, schema: ProjectRequestSchema },
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
    BullModule.registerQueue({
      name: 'email',
    }),
    AuditModule,
  ],
  controllers: [ProjectRequestsController],
  providers: [ProjectRequestsService],
  exports: [ProjectRequestsService],
})
export class ProjectRequestsModule {}
