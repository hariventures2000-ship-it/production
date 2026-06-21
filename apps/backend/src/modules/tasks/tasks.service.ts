import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../../database/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, createdById: string): Promise<TaskDocument> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      createdById,
    });
    return createdTask.save();
  }

  async findAll(query: any = {}): Promise<TaskDocument[]> {
    return this.taskModel
      .find(query)
      .populate('projectId', 'name status')
      .populate('assigneeId', 'firstName lastName email')
      .exec();
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findById(id)
      .populate('projectId', 'name status')
      .populate('assigneeId', 'firstName lastName email')
      .exec();
      
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateData: any): Promise<TaskDocument> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
      
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
