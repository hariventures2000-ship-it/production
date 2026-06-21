import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team, TeamDocument } from '../../database/schemas/team.schema';
import { Task, TaskDocument } from '../../database/schemas/task.schema';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
    const createdTeam = new this.teamModel(createTeamDto);
    return createdTeam.save();
  }

  async findAll(query: any = {}): Promise<TeamDocument[]> {
    return this.teamModel
      .find(query)
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .exec();
  }

  async findByLead(userId: string): Promise<TeamDocument[]> {
    return this.teamModel
      .find({ leadId: userId })
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .exec();
  }

  async findMyTeam(userId: string): Promise<TeamDocument | null> {
    // Find team where user is lead or member
    return this.teamModel
      .findOne({
        $or: [
          { leadId: userId },
          { memberIds: userId },
        ],
      })
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .exec();
  }

  async findOne(id: string): Promise<TeamDocument> {
    const team = await this.teamModel
      .findById(id)
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .populate('projectIds', 'name status')
      .exec();

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async update(id: string, updateData: any): Promise<TeamDocument> {
    const updatedTeam = await this.teamModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedTeam) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return updatedTeam;
  }

  async addMember(teamId: string, userId: string): Promise<TeamDocument> {
    const team = await this.findOne(teamId);

    if (team.memberIds.length >= team.maxCapacity) {
      throw new BadRequestException(
        `Team "${team.name}" has reached its maximum capacity of ${team.maxCapacity} members.`,
      );
    }

    const memberObjectId = new Types.ObjectId(userId);
    if (team.memberIds.some((m) => m.equals(memberObjectId))) {
      throw new BadRequestException('User is already a member of this team.');
    }

    return this.teamModel
      .findByIdAndUpdate(
        teamId,
        { $addToSet: { memberIds: userId } },
        { new: true },
      )
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .exec() as Promise<TeamDocument>;
  }

  async removeMember(teamId: string, userId: string): Promise<TeamDocument> {
    const team = await this.findOne(teamId);

    if (team.leadId.toString() === userId) {
      throw new BadRequestException('Cannot remove the team lead from the team.');
    }

    return this.teamModel
      .findByIdAndUpdate(
        teamId,
        { $pull: { memberIds: userId } },
        { new: true },
      )
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .exec() as Promise<TeamDocument>;
  }

  async getTeamWorkload(teamId: string): Promise<any[]> {
    const team = await this.findOne(teamId);
    const allMemberIds = [team.leadId, ...team.memberIds];

    const workload = await this.taskModel.aggregate([
      { $match: { assigneeId: { $in: allMemberIds } } },
      {
        $group: {
          _id: '$assigneeId',
          totalTasks: { $sum: 1 },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] },
          },
          totalPoints: { $sum: '$storyPoints' },
        },
      },
    ]);

    return workload;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teamModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
  }

  async countByDepartment(): Promise<Record<string, number>> {
    const results = await this.teamModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);
    return results.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
  }
}
