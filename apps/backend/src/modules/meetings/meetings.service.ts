import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from '../../database/schemas/meeting.schema';
import { Counter, CounterDocument } from '../../database/schemas/counter.schema';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private readonly auditService: AuditService,
  ) {}

  private async getClientByUserId(userId: string): Promise<ClientDocument> {
    const client = await this.clientModel.findOne({ userId });
    if (!client) throw new NotFoundException('Client profile not found');
    return client;
  }

  private async getNextSequence(name: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return counter.seq;
  }

  async createMeeting(userId: string, data: any) {
    const client = await this.getClientByUserId(userId);
    const seq = await this.getNextSequence('meetingId');
    const meetingId = `MET${seq.toString().padStart(6, '0')}`;

    const newMeeting = await this.meetingModel.create({
      meetingId,
      clientId: client._id,
      projectId: data.projectId,
      purpose: data.purpose,
      requestedDate: new Date(data.requestedDate),
      provider: data.provider || 'GOOGLE_MEET',
      status: 'PENDING',
    });

    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.MEETING_REQUESTED as any,
      module: 'meetings',
      metadata: { meetingId: newMeeting._id, code: meetingId },
    });

    return newMeeting;
  }

  async getClientMeetings(userId: string) {
    const client = await this.getClientByUserId(userId);
    return this.meetingModel.find({ clientId: client._id }).sort({ requestedDate: 1 }).lean();
  }

  async cancelMeeting(userId: string, id: string) {
    const client = await this.getClientByUserId(userId);
    const meeting = await this.meetingModel.findOne({ _id: id, clientId: client._id });
    if (!meeting) throw new NotFoundException('Meeting not found');

    if (meeting.status !== 'PENDING') {
      throw new BadRequestException('Can only cancel PENDING meetings');
    }

    await this.meetingModel.deleteOne({ _id: id });
    return { success: true };
  }

  // --------------------------------------------------------------------------
  // INTERNAL ENDPOINTS
  // --------------------------------------------------------------------------

  async getAllInternalMeetings() {
    return this.meetingModel.find().sort({ requestedDate: 1 }).lean();
  }

  async approveMeeting(userId: string, meetingId: string, data: any) {
    const meeting = await this.meetingModel.findById(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');

    meeting.status = 'APPROVED';
    meeting.meetingLink = data.meetingLink; // Future: Generate via provider SDK
    meeting.participants = data.participants || [];
    meeting.approvedBy = userId as any;
    meeting.approvedAt = new Date();

    await meeting.save();

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.MEETING_APPROVED as any,
      module: 'meetings',
      metadata: { meetingId },
    });

    return meeting;
  }

  async rejectMeeting(userId: string, meetingId: string, data: any) {
    const meeting = await this.meetingModel.findById(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');

    meeting.status = 'REJECTED';
    meeting.notes = data.notes;
    meeting.rejectedBy = userId as any;
    meeting.rejectedAt = new Date();

    await meeting.save();

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.MEETING_REJECTED as any,
      module: 'meetings',
      metadata: { meetingId },
    });

    return meeting;
  }

  async rescheduleMeeting(userId: string, meetingId: string, data: any) {
    const meeting = await this.meetingModel.findById(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');

    meeting.requestedDate = new Date(data.newDate);
    meeting.rescheduledBy = userId as any;
    meeting.rescheduledAt = new Date();
    
    // Reset to pending so it can be approved again, or automatically approve it
    meeting.status = 'PENDING';

    await meeting.save();

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.MEETING_RESCHEDULED as any,
      module: 'meetings',
      metadata: { meetingId, newDate: meeting.requestedDate },
    });

    return meeting;
  }
}
