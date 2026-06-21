import { IsString, IsNotEmpty, IsOptional, IsEnum, IsMongoId, IsDateString, IsNumber, Min } from 'class-validator';
import { SprintStatus } from '@hariventure/types';

export class CreateSprintDto {
  @IsMongoId()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsEnum(SprintStatus)
  @IsOptional()
  status?: SprintStatus;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  capacity?: number;
}
