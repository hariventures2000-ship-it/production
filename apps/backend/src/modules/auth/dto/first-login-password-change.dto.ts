import { IsString, IsNotEmpty } from 'class-validator';
// @ts-ignore
import { MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FirstLoginPasswordChangeDto {
  @ApiProperty({ example: 'NewSecurePassword123!', minLength: 12, maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  @MaxLength(64, { message: 'Password cannot exceed 64 characters' })
  newPassword: string;
}
