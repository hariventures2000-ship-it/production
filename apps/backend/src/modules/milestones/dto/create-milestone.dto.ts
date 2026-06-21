import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsDateString } from 'class-validator';
import { IsIn } from 'class-validator';

export class CreateMilestoneDto {
  @IsMongoId()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
  @IsOptional()
  status?: string;
}
