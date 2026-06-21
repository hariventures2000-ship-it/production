import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectMilestone, ProjectMilestoneDocument } from '../../database/schemas/project-milestone.schema';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectModel(ProjectMilestone.name)
    private readonly milestoneModel: Model<ProjectMilestoneDocument>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto): Promise<ProjectMilestoneDocument> {
    const createdMilestone = new this.milestoneModel(createMilestoneDto);
    return createdMilestone.save();
  }

  async findAll(query: any = {}): Promise<ProjectMilestoneDocument[]> {
    return this.milestoneModel
      .find(query)
      .populate('projectId', 'name status')
      .sort({ targetDate: 1 })
      .exec();
  }

  async findByProject(projectId: string): Promise<ProjectMilestoneDocument[]> {
    return this.milestoneModel
      .find({ projectId })
      .sort({ targetDate: 1 })
      .exec();
  }

  async findOne(id: string): Promise<ProjectMilestoneDocument> {
    const milestone = await this.milestoneModel
      .findById(id)
      .populate('projectId', 'name status')
      .exec();

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return milestone;
  }

  async update(id: string, updateData: any): Promise<ProjectMilestoneDocument> {
    const updatedMilestone = await this.milestoneModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedMilestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return updatedMilestone;
  }

  async complete(id: string): Promise<ProjectMilestoneDocument> {
    const milestone = await this.findOne(id);

    if (milestone.status === 'COMPLETED') {
      throw new BadRequestException('Milestone is already completed.');
    }

    return this.milestoneModel
      .findByIdAndUpdate(
        id,
        {
          status: 'COMPLETED',
          completedDate: new Date(),
        },
        { new: true },
      )
      .exec() as Promise<ProjectMilestoneDocument>;
  }

  async remove(id: string): Promise<void> {
    const result = await this.milestoneModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
  }

  async getProjectProgress(projectId: string): Promise<{ total: number; completed: number; percentage: number }> {
    const milestones = await this.findByProject(projectId);
    const total = milestones.length;
    const completed = milestones.filter((m) => m.status === 'COMPLETED').length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
