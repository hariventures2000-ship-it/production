import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from '../../database/schemas/leave.schema';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leave.name) private readonly leaveModel: Model<LeaveDocument>,
  ) {}

  async create(createLeaveDto: CreateLeaveDto): Promise<LeaveDocument> {
    const createdLeave = new this.leaveModel(createLeaveDto);
    return createdLeave.save();
  }

  async findAll(query: any = {}): Promise<LeaveDocument[]> {
    return this.leaveModel
      .find(query)
      .populate('employeeId', 'firstName lastName email department')
      .populate('approvedById', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByEmployee(employeeId: string): Promise<LeaveDocument[]> {
    return this.leaveModel
      .find({ employeeId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPending(): Promise<LeaveDocument[]> {
    return this.leaveModel
      .find({ status: 'PENDING' })
      .populate('employeeId', 'firstName lastName email department')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPendingByTeamMembers(memberIds: string[]): Promise<LeaveDocument[]> {
    return this.leaveModel
      .find({
        employeeId: { $in: memberIds },
        status: 'PENDING',
      })
      .populate('employeeId', 'firstName lastName email department')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<LeaveDocument> {
    const leave = await this.leaveModel
      .findById(id)
      .populate('employeeId', 'firstName lastName email department')
      .populate('approvedById', 'firstName lastName email')
      .exec();

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }

  async approve(id: string, approvedById: string): Promise<LeaveDocument> {
    const leave = await this.findOne(id);

    if (leave.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot approve leave in "${leave.status}" status. Only PENDING leaves can be approved.`,
      );
    }

    return this.leaveModel
      .findByIdAndUpdate(
        id,
        {
          status: 'APPROVED',
          approvedById,
          processedAt: new Date(),
        },
        { new: true },
      )
      .populate('employeeId', 'firstName lastName email department')
      .exec() as Promise<LeaveDocument>;
  }

  async reject(id: string, reason: string, rejectedById: string): Promise<LeaveDocument> {
    const leave = await this.findOne(id);

    if (leave.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot reject leave in "${leave.status}" status. Only PENDING leaves can be rejected.`,
      );
    }

    return this.leaveModel
      .findByIdAndUpdate(
        id,
        {
          status: 'REJECTED',
          approvedById: rejectedById,
          rejectionReason: reason,
          processedAt: new Date(),
        },
        { new: true },
      )
      .populate('employeeId', 'firstName lastName email department')
      .exec() as Promise<LeaveDocument>;
  }

  async cancel(id: string): Promise<LeaveDocument> {
    const leave = await this.findOne(id);

    if (leave.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel leave in "${leave.status}" status. Only PENDING leaves can be cancelled.`,
      );
    }

    return this.leaveModel
      .findByIdAndUpdate(id, { status: 'CANCELLED' }, { new: true })
      .exec() as Promise<LeaveDocument>;
  }

  async countPending(): Promise<number> {
    return this.leaveModel.countDocuments({ status: 'PENDING' }).exec();
  }

  async getLeaveStats(): Promise<Record<string, number>> {
    const results = await this.leaveModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return results.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
  }
}
