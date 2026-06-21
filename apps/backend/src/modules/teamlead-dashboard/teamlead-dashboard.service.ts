import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../database/schemas/project.schema';
import { Task, TaskDocument } from '../../database/schemas/task.schema';
import { Team, TeamDocument } from '../../database/schemas/team.schema';
import { Sprint, SprintDocument } from '../../database/schemas/sprint.schema';
import { Leave, LeaveDocument } from '../../database/schemas/leave.schema';

@Injectable()
export class TeamleadDashboardService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Sprint.name) private readonly sprintModel: Model<SprintDocument>,
    @InjectModel(Leave.name) private readonly leaveModel: Model<LeaveDocument>,
  ) {}

  async getOverview(userId: string): Promise<any> {
    // Find the team led by this user
    const myTeam = await this.teamModel
      .findOne({ leadId: userId })
      .populate('memberIds', 'firstName lastName email')
      .exec();

    const teamMemberIds = myTeam
      ? [myTeam.leadId, ...myTeam.memberIds].map((id) => id.toString())
      : [userId];

    const [myProjects, tasksByStatus, activeSprintCount, pendingLeaves] =
      await Promise.all([
        this.projectModel.countDocuments({ teamLeadId: userId }),
        this.taskModel.aggregate([
          { $match: { assigneeId: { $in: teamMemberIds.map((id) => id) } } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        this.sprintModel.countDocuments({
          status: 'ACTIVE',
          projectId: {
            $in: await this.projectModel
              .find({ teamLeadId: userId })
              .distinct('_id'),
          },
        }),
        this.leaveModel.countDocuments({
          employeeId: { $in: teamMemberIds },
          status: 'PENDING',
        }),
      ]);

    const taskStatusMap = tasksByStatus.reduce(
      (acc: Record<string, number>, { _id, count }: { _id: string; count: number }) => ({ ...acc, [_id]: count }),
      {},
    );

    return {
      teamMembers: myTeam ? myTeam.memberIds.length + 1 : 1, // +1 for lead
      teamName: myTeam?.name || 'My Team',
      myProjectsCount: myProjects,
      pendingLeaves,
      activeSprintCount,
      tasksByStatus: taskStatusMap,
      totalActiveTasks:
        (taskStatusMap['IN_PROGRESS'] || 0) +
        (taskStatusMap['REVIEW'] || 0) +
        (taskStatusMap['TESTING'] || 0),
    };
  }

  async getMyProjects(userId: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ teamLeadId: userId })
      .populate('clientId', 'name company email')
      .populate('teamId', 'name department')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getMyTeam(userId: string): Promise<any> {
    const team = await this.teamModel
      .findOne({ leadId: userId })
      .populate('leadId', 'firstName lastName email')
      .populate('memberIds', 'firstName lastName email')
      .exec();

    if (!team) {
      return { team: null, memberWorkloads: [] };
    }

    const allMemberIds = [team.leadId, ...team.memberIds];

    const memberWorkloads = await this.taskModel.aggregate([
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

    return { team, memberWorkloads };
  }

  async getPendingLeaves(userId: string): Promise<LeaveDocument[]> {
    const team = await this.teamModel.findOne({ leadId: userId }).exec();

    if (!team) {
      return [];
    }

    const memberIds = [team.leadId, ...team.memberIds].map((id) => id.toString());

    return this.leaveModel
      .find({
        employeeId: { $in: memberIds },
        status: 'PENDING',
      })
      .populate('employeeId', 'firstName lastName email department')
      .sort({ createdAt: -1 })
      .exec();
  }
}
