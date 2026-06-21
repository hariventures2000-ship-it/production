import { Injectable, NotFoundException, ForbiddenException, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../database/schemas/project.schema';
import { ProjectUpdate, ProjectUpdateDocument } from '../../database/schemas/project-update.schema';
import { ProjectMilestone, ProjectMilestoneDocument } from '../../database/schemas/project-milestone.schema';
import { DocumentFile, DocumentFileDocument } from '../../database/schemas/document.schema';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class ClientPortalService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectUpdate.name) private updateModel: Model<ProjectUpdateDocument>,
    @InjectModel(ProjectMilestone.name) private milestoneModel: Model<ProjectMilestoneDocument>,
    @InjectModel(DocumentFile.name) private documentModel: Model<DocumentFileDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private readonly auditService: AuditService,
  ) {}

  private async getClientByUserId(userId: string): Promise<ClientDocument> {
    let client = await this.clientModel.findOne({ userId });
    
    // Automatically create a client profile if one doesn't exist for the authenticated user
    if (!client) {
      client = await this.clientModel.create({
        userId,
        companyName: 'My Company',
        contactEmail: 'unspecified@hariventure.com', // Will be updated by profile settings later
      });
    }
    
    return client;
  }

  async getProjects(userId: string) {
    const client = await this.getClientByUserId(userId);
    const projects = await this.projectModel.find({ clientId: client._id })
      .select('name description currentPhase completionPercentage status estimatedEndDate actualEndDate createdAt updatedAt')
      .lean();
    return projects;
  }

  async getProject(userId: string, projectId: string) {
    const client = await this.getClientByUserId(userId);
    const project = await this.projectModel.findOne({ _id: projectId, clientId: client._id })
      .select('name description currentPhase completionPercentage status estimatedEndDate actualEndDate budget actualCost repositoryUrl liveUrl createdAt updatedAt')
      .lean();
    if (!project) throw new NotFoundException('Project not found or access denied');
    
    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.PROJECT_VIEWED as any,
      module: 'client-portal',
      metadata: { projectId },
    });
    
    return project;
  }

  async getMilestones(userId: string, projectId: string) {
    const client = await this.getClientByUserId(userId);
    const project = await this.projectModel.findOne({ _id: projectId, clientId: client._id }).select('_id');
    if (!project) throw new NotFoundException('Project not found or access denied');

    const milestones = await this.milestoneModel.find({ projectId: project._id })
      .sort({ targetDate: 1 })
      .lean();

    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.MILESTONE_VIEWED as any,
      module: 'client-portal',
      metadata: { projectId },
    });

    return milestones;
  }

  async getUpdates(userId: string, projectId: string) {
    const client = await this.getClientByUserId(userId);
    const project = await this.projectModel.findOne({ _id: projectId, clientId: client._id }).select('_id');
    if (!project) throw new NotFoundException('Project not found or access denied');

    const updates = await this.updateModel.find({ 
      projectId: project._id, 
      isApprovedForClient: true 
    })
      .sort({ createdAt: -1 })
      .lean();

    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.PROJECT_UPDATE_VIEWED as any,
      module: 'client-portal',
      metadata: { projectId },
    });

    return updates;
  }

  async getDocuments(userId: string, projectId: string, type?: string, search?: string) {
    const client = await this.getClientByUserId(userId);
    const project = await this.projectModel.findOne({ _id: projectId, clientId: client._id }).select('_id');
    if (!project) throw new NotFoundException('Project not found or access denied');

    let query: any = { 
      projectId: project._id, 
      isApproved: true,
      isClientVisible: true
    };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
      
      await this.auditService.logEvent({
        userId,
        role: 'CLIENT' as any,
        action: AuditEvent.DOCUMENT_SEARCHED as any,
        module: 'client-portal',
        metadata: { projectId, search },
      });
    }

    const documents = await this.documentModel.find(query)
      .select('name type sizeBytes mimeType createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return documents;
  }

  async downloadDocument(userId: string, projectId: string, documentId: string) {
    const client = await this.getClientByUserId(userId);
    const project = await this.projectModel.findOne({ _id: projectId, clientId: client._id }).select('_id');
    if (!project) throw new NotFoundException('Project not found or access denied');

    const document = await this.documentModel.findOne({ 
      _id: documentId, 
      projectId: project._id, 
      isApproved: true,
      isClientVisible: true
    });
    
    if (!document) throw new NotFoundException('Document not found or access denied');

    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.DOCUMENT_DOWNLOADED as any,
      module: 'client-portal',
      metadata: { projectId, documentId },
    });

    // We return the secure cloudinary URL or a pre-signed URL to the client.
    // For this implementation, returning the URL as JSON response is safer and easier.
    return { url: document.cloudinaryUrl, name: document.name };
  }
}
