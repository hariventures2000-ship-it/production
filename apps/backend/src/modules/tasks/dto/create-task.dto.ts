import { IsString, IsNotEmpty, IsOptional, IsEnum, IsMongoId, IsDateString, IsNumber, Min } from 'class-validator';
import { TaskStatus, TaskPriority, TaskType, EmployeeSubRole } from '@hariventure/types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  projectId: string;

  @IsMongoId()
  @IsOptional()
  sprintId?: string;

  @IsMongoId()
  @IsOptional()
  assigneeId?: string;

  @IsString()
  @IsOptional()
  requiredSubRole?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  storyPoints?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
