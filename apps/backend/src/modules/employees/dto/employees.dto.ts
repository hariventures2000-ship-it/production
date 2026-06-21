import {
  IsString, IsOptional, IsEnum, IsNumber, IsNotEmpty,
  IsDateString, IsArray, Min, Max, ArrayMaxSize,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EmployeeSubRole, Department } from '@hariventure/types';

// ═══════════════════════════════════════════════════════════════════
// Employees DTOs — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

// ─── CREATE EMPLOYEE ─────────────────────────────────────────────────

export class SalaryDto {
  @ApiProperty({ example: 50000 })
  @IsNumber() @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsString() @IsOptional()
  currency?: string = 'INR';

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  effectiveDate: string;
}

export class CreateEmployeeDto {
  @ApiProperty({ description: 'User ObjectId — must exist and be an internal user' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ example: 'HVD-001', description: 'Unique employee ID (e.g. HVD-001)' })
  @IsString() @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ enum: EmployeeSubRole, example: EmployeeSubRole.DEVELOPER })
  @IsEnum(EmployeeSubRole)
  subRole: EmployeeSubRole;

  @ApiProperty({ enum: Department, example: Department.WEBSITE_DEVELOPMENT })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({ type: SalaryDto })
  @Type(() => SalaryDto)
  salary: SalaryDto;

  @ApiProperty({ example: '2024-01-15', description: 'Date of joining' })
  @IsDateString()
  joiningDate: string;

  @ApiPropertyOptional({ type: [String], example: ['React', 'Node.js', 'TypeScript'] })
  @IsArray() @IsString({ each: true }) @ArrayMaxSize(20) @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ example: 3, description: 'Years of experience' })
  @IsNumber() @Min(0) @Max(50) @IsOptional()
  @Type(() => Number)
  experienceYears?: number;

  @ApiPropertyOptional({ description: 'Team ObjectId — assigned after creation' })
  @IsMongoId() @IsOptional()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Manager (Team Lead) User ObjectId' })
  @IsMongoId() @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ description: 'Reporting to (HR/CEO) User ObjectId' })
  @IsMongoId() @IsOptional()
  reportingTo?: string;
}

// ─── UPDATE EMPLOYEE ─────────────────────────────────────────────────

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ enum: EmployeeSubRole })
  @IsEnum(EmployeeSubRole) @IsOptional()
  subRole?: EmployeeSubRole;

  @ApiPropertyOptional({ enum: Department })
  @IsEnum(Department) @IsOptional()
  department?: Department;

  @ApiPropertyOptional({ type: [String] })
  @IsArray() @IsString({ each: true }) @ArrayMaxSize(20) @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ example: 4 })
  @IsNumber() @Min(0) @Max(50) @IsOptional()
  @Type(() => Number)
  experienceYears?: number;

  @ApiPropertyOptional({ description: 'Team ObjectId' })
  @IsMongoId() @IsOptional()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Manager User ObjectId' })
  @IsMongoId() @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ description: 'Reporting to User ObjectId' })
  @IsMongoId() @IsOptional()
  reportingTo?: string;

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'],
    example: 'ACTIVE',
  })
  @IsEnum(['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED']) @IsOptional()
  status?: string;
}

// ─── UPDATE SALARY ────────────────────────────────────────────────────

export class UpdateSalaryDto {
  @ApiProperty({ example: 60000 })
  @IsNumber() @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ example: 'INR' })
  @IsString() @IsOptional()
  currency?: string;

  @ApiProperty({ example: '2024-07-01', description: 'Effective date of new salary' })
  @IsDateString()
  effectiveDate: string;
}

// ─── ADD PERFORMANCE ENTRY ────────────────────────────────────────────

export class AddPerformanceDto {
  @ApiProperty({ example: 85, description: 'Score 0–100' })
  @IsNumber() @Min(0) @Max(100)
  @Type(() => Number)
  score: number;

  @ApiProperty({ example: 'Q1-2025', description: 'Review period label' })
  @IsString() @IsNotEmpty()
  period: string;

  @ApiPropertyOptional({ example: 'Excellent delivery on e-commerce project' })
  @IsString() @IsOptional()
  notes?: string;
}

// ─── TERMINATE EMPLOYEE ───────────────────────────────────────────────

export class TerminateEmployeeDto {
  @ApiProperty({ example: '2025-06-30' })
  @IsDateString()
  terminationDate: string;

  @ApiProperty({ example: 'Resignation — voluntary' })
  @IsString() @IsNotEmpty()
  terminationReason: string;
}

// ─── LIST EMPLOYEES QUERY ─────────────────────────────────────────────

export class ListEmployeesQueryDto {
  @ApiPropertyOptional({ enum: Department })
  @IsEnum(Department) @IsOptional()
  department?: Department;

  @ApiPropertyOptional({ enum: EmployeeSubRole })
  @IsEnum(EmployeeSubRole) @IsOptional()
  subRole?: EmployeeSubRole;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'] })
  @IsEnum(['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED']) @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by team ObjectId' })
  @IsMongoId() @IsOptional()
  teamId?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
