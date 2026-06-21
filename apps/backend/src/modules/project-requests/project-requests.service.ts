import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectRequest, ProjectRequestDocument, ProjectRequestStatus } from '../../database/schemas/project-request.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { Counter, CounterDocument } from '../../database/schemas/counter.schema';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { ReviewProjectRequestDto } from './dto/review-project-request.dto';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { AuthType, Role } from '@hariventure/types';

@Injectable()
export class ProjectRequestsService {
  constructor(
    @InjectModel(ProjectRequest.name) private requestModel: Model<ProjectRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    private readonly auditService: AuditService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async create(dto: CreateProjectRequestDto) {
    const request = new this.requestModel(dto);
    await request.save();

    await this.auditService.logEvent({
      action: AuditEvent.PROJECT_REQUEST_SUBMITTED,
      module: 'project-requests',
      metadata: { requestId: request._id, companyName: dto.companyName },
    });

    return request;
  }

  async findAll() {
    return this.requestModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const request = await this.requestModel.findById(id).populate('reviewedBy', 'firstName lastName email role');
    if (!request) {
      throw new NotFoundException('Project request not found');
    }
    return request;
  }

  async review(id: string, dto: ReviewProjectRequestDto, reviewer: any) {
    const request = await this.requestModel.findById(id);
    if (!request) {
      throw new NotFoundException('Project request not found');
    }

    if (request.status === ProjectRequestStatus.APPROVED || request.status === ProjectRequestStatus.REJECTED) {
      throw new BadRequestException('Project request has already been processed');
    }

    request.status = dto.status;
    request.reviewedBy = new Types.ObjectId(reviewer.sub);
    request.reviewedAt = new Date();
    request.reviewNotes = dto.notes || null;

    if (dto.status === ProjectRequestStatus.APPROVED) {
      await this.handleApproval(request);
      await this.auditService.logEvent({
        action: AuditEvent.PROJECT_REQUEST_APPROVED,
        module: 'project-requests',
        userId: reviewer.sub,
        metadata: { requestId: request._id, companyName: request.companyName },
      });
    } else {
      await this.auditService.logEvent({
        action: AuditEvent.PROJECT_REQUEST_REJECTED,
        module: 'project-requests',
        userId: reviewer.sub,
        metadata: { requestId: request._id, companyName: request.companyName },
      });
    }

    await request.save();
    return request;
  }

  private async handleApproval(request: ProjectRequestDocument) {
    // 1. Generate unique Client ID securely and concurrently (Atomic Counter)
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'clientId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const nextIdNumber = counter.seq;
    const clientIdStr = `CLT${nextIdNumber.toString().padStart(6, '0')}`;

    // 2. Generate secure temporary password
    const tempPassword = `Temp@${crypto.randomInt(10000, 99999)}`;
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // 3. Create User record (Client Auth)
    const user = new this.userModel({
      role: Role.CLIENT,
      authType: AuthType.CLIENT,
      firstName: request.contactPerson.split(' ')[0],
      lastName: request.contactPerson.split(' ').slice(1).join(' ') || 'Client',
      email: request.email,
      phone: request.phone,
      passwordHash,
      isActive: true,
      isEmailVerified: true,
      isFirstLogin: true, // Requires forced password change
    });
    await user.save();

    // 4. Create Client record
    const client = new this.clientModel({
      userId: user._id,
      companyName: request.companyName,
      contactEmail: request.email,
      contactPhone: request.phone,
      status: 'ACTIVE',
      clientId: clientIdStr,
    });
    await client.save();

    request.generatedClientId = client._id;

    await this.auditService.logEvent({
      action: AuditEvent.CLIENT_ACCOUNT_CREATED,
      module: 'project-requests',
      metadata: { requestId: request._id, clientId: client._id, userId: user._id, clientCode: clientIdStr },
    });

    // 5. Send Resend Email
    await this.emailQueue.add('send-client-onboarding-email', {
      to: request.email,
      name: request.contactPerson,
      clientId: request.email, // Often they login with email
      tempPassword,
    });
  }
}
