import { IsString, IsNotEmpty, IsOptional, IsEnum, IsMongoId, IsDateString, IsNumber, Min } from 'class-validator';
import { Department, ProjectStatus, ProjectPriority } from '@hariventure/types';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsEnum(Department)
  @IsNotEmpty()
  department: Department;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  estimatedEndDate: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  budget: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
