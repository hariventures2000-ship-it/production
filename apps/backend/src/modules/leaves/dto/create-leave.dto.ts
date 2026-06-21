import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsDateString, IsNumber, Min } from 'class-validator';
import { IsIn } from 'class-validator';

export class CreateLeaveDto {
  @IsMongoId()
  @IsNotEmpty()
  employeeId: string;

  @IsIn(['ANNUAL', 'SICK', 'CASUAL', 'MATERNITY', 'PATERNITY', 'UNPAID'])
  @IsNotEmpty()
  type: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @Min(0.5)
  @IsNotEmpty()
  totalDays: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
