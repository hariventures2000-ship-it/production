import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
// @ts-ignore
import { MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectRequestDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  companyName: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contactPerson: string;

  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'E-commerce Redesign' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'We need a new e-commerce website...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: '$50k - $100k' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  budgetRange: string;

  @ApiProperty({ example: '3-6 months' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  timeline: string;
}
