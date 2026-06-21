import { IsString, IsEnum, IsOptional } from 'class-validator';
// @ts-ignore
import { MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectRequestStatus } from '../../../database/schemas/project-request.schema';

export class ReviewProjectRequestDto {
  @ApiProperty({ enum: [ProjectRequestStatus.APPROVED, ProjectRequestStatus.REJECTED] })
  @IsEnum(ProjectRequestStatus)
  status: ProjectRequestStatus;

  @ApiProperty({ required: false, example: 'Approved for Q3 timeline.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
