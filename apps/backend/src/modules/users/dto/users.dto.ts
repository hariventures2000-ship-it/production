import {
  IsString, IsOptional, IsEnum, IsBoolean,
  IsNotEmpty, MinLength, Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Role, AuthType } from '@hariventure/types';
import { Type } from 'class-transformer';

// ═══════════════════════════════════════════════════════════════════
// Users DTOs — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

// ─── CREATE INTERNAL USER (CEO / HR only) ───────────────────────────

export class CreateInternalUserDto {
  @ApiProperty({ example: 'John' })
  @IsString() @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString() @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe', description: 'Unique username for internal login' })
  @IsString() @IsNotEmpty()
  @Matches(/^[a-z][a-z0-9._-]{2,30}$/, {
    message: 'Username must be 3-31 chars: lowercase letters, numbers, dots, hyphens, underscores',
  })
  username: string;

  @ApiProperty({ enum: Role, example: Role.EMPLOYEE, description: 'Must be an internal role' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: '+91 9876543210', required: false })
  @IsString() @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'TempPass123!',
    description: 'Initial password — user must change on first login',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}

// ─── UPDATE USER PROFILE (self) ─────────────────────────────────────

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString() @IsNotEmpty() @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString() @IsNotEmpty() @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '+91 9876543210' })
  @IsString() @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Cloudinary URL to avatar image' })
  @IsString() @IsOptional()
  avatar?: string;
}

// ─── UPDATE USER (admin) ─────────────────────────────────────────────

export class AdminUpdateUserDto extends PartialType(UpdateUserProfileDto) {
  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role) @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ description: 'Activate or deactivate user' })
  @IsBoolean() @IsOptional()
  isActive?: boolean;
}

// ─── LIST USERS QUERY ────────────────────────────────────────────────

export class ListUsersQueryDto {
  @ApiPropertyOptional({ enum: Role })
  @IsEnum(Role) @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ enum: AuthType })
  @IsEnum(AuthType) @IsOptional()
  authType?: AuthType;

  @ApiPropertyOptional({ description: 'true = active only, false = inactive only' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
