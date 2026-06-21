import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientPortalService } from './client-portal.service';
import { ClientPortalController } from './client-portal.controller';
import { Project, ProjectSchema } from '../../database/schemas/project.schema';
import { ProjectUpdate, ProjectUpdateSchema } from '../../database/schemas/project-update.schema';
import { ProjectMilestone, ProjectMilestoneSchema } from '../../database/schemas/project-milestone.schema';
import { DocumentFile, DocumentFileSchema } from '../../database/schemas/document.schema';
import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectUpdate.name, schema: ProjectUpdateSchema },
      { name: ProjectMilestone.name, schema: ProjectMilestoneSchema },
      { name: DocumentFile.name, schema: DocumentFileSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    AuditModule,
  ],
  controllers: [ClientPortalController],
  providers: [ClientPortalService],
})
export class ClientPortalModule {}
