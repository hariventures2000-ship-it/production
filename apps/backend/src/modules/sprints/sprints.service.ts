import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sprint, SprintDocument } from '../../database/schemas/sprint.schema';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { SprintStatus } from '@hariventure/types';

@Injectable()
export class SprintsService {
  constructor(
    @InjectModel(Sprint.name) private readonly sprintModel: Model<SprintDocument>,
  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<SprintDocument> {
    const createdSprint = new this.sprintModel(createSprintDto);
    return createdSprint.save();
  }

  async findAll(query: any = {}): Promise<SprintDocument[]> {
    return this.sprintModel
      .find(query)
      .populate('projectId', 'name status')
      .sort({ startDate: -1 })
      .exec();
  }

  async findByProject(projectId: string): Promise<SprintDocument[]> {
    return this.sprintModel
      .find({ projectId })
      .sort({ startDate: -1 })
      .exec();
  }

  async findOne(id: string): Promise<SprintDocument> {
    const sprint = await this.sprintModel
      .findById(id)
      .populate('projectId', 'name status')
      .populate('taskIds')
      .exec();

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async update(id: string, updateData: any): Promise<SprintDocument> {
    const updatedSprint = await this.sprintModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedSprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return updatedSprint;
  }

  async activate(id: string): Promise<SprintDocument> {
    const sprint = await this.findOne(id);

    if (sprint.status !== SprintStatus.PLANNING) {
      throw new BadRequestException(
        `Cannot activate sprint in "${sprint.status}" status. Only PLANNING sprints can be activated.`,
      );
    }

    // Check no other active sprint exists for the same project
    const activeSprint = await this.sprintModel.findOne({
      projectId: sprint.projectId,
      status: SprintStatus.ACTIVE,
    });

    if (activeSprint) {
      throw new BadRequestException(
        `Project already has an active sprint: "${activeSprint.name}". Complete it before activating a new one.`,
      );
    }

    return this.update(id, { status: SprintStatus.ACTIVE });
  }

  async complete(id: string): Promise<SprintDocument> {
    const sprint = await this.findOne(id);

    if (sprint.status !== SprintStatus.ACTIVE) {
      throw new BadRequestException(
        `Cannot complete sprint in "${sprint.status}" status. Only ACTIVE sprints can be completed.`,
      );
    }

    return this.update(id, { status: SprintStatus.COMPLETED });
  }

  async remove(id: string): Promise<void> {
    const result = await this.sprintModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
  }

  async countByStatus(): Promise<Record<string, number>> {
    const results = await this.sprintModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return results.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
  }
}
