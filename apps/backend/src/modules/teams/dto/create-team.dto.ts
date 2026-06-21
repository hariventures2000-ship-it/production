import { IsString, IsNotEmpty, IsOptional, IsEnum, IsMongoId, IsNumber, Min, IsArray } from 'class-validator';
import { Department } from '@hariventure/types';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  leadId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  memberIds?: string[];

  @IsEnum(Department)
  @IsNotEmpty()
  department: Department;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxCapacity?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}
