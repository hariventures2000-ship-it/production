import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../database/schemas/project.schema';
import { Task, TaskDocument } from '../../database/schemas/task.schema';
import { Employee, EmployeeDocument } from '../../database/schemas/employee.schema';
import { Sprint, SprintDocument } from '../../database/schemas/sprint.schema';
import { Team, TeamDocument } from '../../database/schemas/team.schema';
import { Leave, LeaveDocument } from '../../database/schemas/leave.schema';
import { ProjectMilestone, ProjectMilestoneDocument } from '../../database/schemas/project-milestone.schema';

@Injectable()
export class MdDashboardService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Sprint.name) private readonly sprintModel: Model<SprintDocument>,
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Leave.name) private readonly leaveModel: Model<LeaveDocument>,
    @InjectModel(ProjectMilestone.name) private readonly milestoneModel: Model<ProjectMilestoneDocument>,
  ) {}

  async getOverview(): Promise<any> {
    const [
      totalProjects,
      projectsByStatus,
      totalEmployees,
      activeSprintCount,
      totalBudget,
      totalActualCost,
      pendingLeaves,
    ] = await Promise.all([
      this.projectModel.countDocuments(),
      this.projectModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.employeeModel.countDocuments({ isActive: true }),
      this.sprintModel.countDocuments({ status: 'ACTIVE' }),
      this.projectModel.aggregate([
        { $group: { _id: null, total: { $sum: '$budget' } } },
      ]),
      this.projectModel.aggregate([
        { $group: { _id: null, total: { $sum: '$actualCost' } } },
      ]),
      this.leaveModel.countDocuments({ status: 'PENDING' }),
    ]);

    const statusMap = projectsByStatus.reduce(
      (acc: Record<string, number>, { _id, count }: { _id: string; count: number }) => ({ ...acc, [_id]: count }),
      {},
    );

    const completedProjects = statusMap['COMPLETED'] || 0;
    const onTimeRate = totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

    return {
      totalProjects,
      activeProjects: (statusMap['DEVELOPMENT'] || 0) + (statusMap['DESIGN'] || 0) + (statusMap['TESTING'] || 0),
      completedProjects,
      projectsByStatus: statusMap,
      totalEmployees,
      activeSprintCount,
      totalBudget: totalBudget[0]?.total || 0,
      totalActualCost: totalActualCost[0]?.total || 0,
      budgetUtilization: totalBudget[0]?.total
        ? Math.round(((totalActualCost[0]?.total || 0) / totalBudget[0].total) * 100)
        : 0,
      onTimeDeliveryRate: onTimeRate,
      pendingLeaves,
    };
  }

  async getProjects(): Promise<ProjectDocument[]> {
    return this.projectModel
      .find()
      .populate('clientId', 'name company email')
      .populate('teamLeadId', 'firstName lastName email')
      .populate('teamId', 'name department')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getWorkforce(): Promise<any> {
    const [departmentBreakdown, teamCount, totalEmployees] = await Promise.all([
      this.employeeModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
      this.teamModel.countDocuments({ isActive: true }),
      this.employeeModel.countDocuments({ isActive: true }),
    ]);

    return {
      totalEmployees,
      totalTeams: teamCount,
      departments: departmentBreakdown.reduce(
        (acc: Record<string, number>, { _id, count }: { _id: string; count: number }) => ({ ...acc, [_id]: count }),
        {},
      ),
    };
  }

  async getBudgetSummary(): Promise<any> {
    const projects = await this.projectModel
      .find({}, 'name budget actualCost status completionPercentage')
      .sort({ budget: -1 })
      .exec();

    const totals = projects.reduce(
      (acc, p) => ({
        totalBudget: acc.totalBudget + (p.budget || 0),
        totalSpent: acc.totalSpent + (p.actualCost || 0),
      }),
      { totalBudget: 0, totalSpent: 0 },
    );

    return {
      ...totals,
      utilization: totals.totalBudget > 0
        ? Math.round((totals.totalSpent / totals.totalBudget) * 100)
        : 0,
      projects: projects.map((p) => ({
        id: p._id,
        name: p.name,
        budget: p.budget,
        actualCost: p.actualCost,
        status: p.status,
        completionPercentage: p.completionPercentage,
        utilization: p.budget > 0
          ? Math.round((p.actualCost / p.budget) * 100)
          : 0,
      })),
    };
  }
}
