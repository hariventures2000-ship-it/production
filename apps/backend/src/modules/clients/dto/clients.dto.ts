import {
  IsString, IsOptional, IsEmail, IsNotEmpty, IsEnum, IsNumber, Min, IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BillingAddressDto {
  @ApiPropertyOptional({ example: '123 Tech Park' })
  @IsString() @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsString() @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString() @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'India', default: 'India' })
  @IsString() @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: '560001' })
  @IsString() @IsOptional()
  postalCode?: string;
}

export class CreateClientDto {
  @ApiProperty({ description: 'The linked user account ID for the client' })
  @IsMongoId() @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsString() @IsNotEmpty()
  companyName: string;

  @ApiPropertyOptional({ example: 'Technology' })
  @IsString() @IsOptional()
  industry?: string;

  @ApiProperty({ example: 'contact@acmecorp.com' })
  @IsEmail() @IsNotEmpty()
  contactEmail: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsString() @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ type: BillingAddressDto })
  @IsOptional()
  @Type(() => BillingAddressDto)
  billingAddress?: BillingAddressDto;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsString() @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'], default: 'PROSPECT' })
  @IsEnum(['ACTIVE', 'INACTIVE', 'PROSPECT'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Key strategic partner' })
  @IsString() @IsOptional()
  notes?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}

export class ListClientsQueryDto {
  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'] })
  @IsEnum(['ACTIVE', 'INACTIVE', 'PROSPECT'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
