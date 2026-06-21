import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── CLIENT DTOs ────────────────────────────────────────────────────

export class ClientRegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString() @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString() @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsString() companyName?: string;

  @ApiProperty({ example: '+91 9876543210', required: false })
  @IsString() phone?: string;
}

export class ClientLoginDto {
  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  email: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email verification token from link' })
  @IsString() @IsNotEmpty()
  token: string;
}

export class VerifyClientOtpDto {
  @ApiProperty({ example: '123456', description: '6-digit OTP from email' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}

export class ResendOtpDto {
}

// ─── INTERNAL USER DTOs ─────────────────────────────────────────────

export class InternalLoginDto {
  @ApiPropertyOptional({ example: 'john.doe' })
  @IsString() @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'john@hariventure.com' })
  @IsEmail() @IsOptional()
  email?: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString() @IsNotEmpty()
  password: string;
}

export class VerifyTotpDto {
  @ApiProperty({ example: '123456', description: '6-digit TOTP from Microsoft Authenticator' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'TOTP must be exactly 6 digits' })
  totpCode: string;
}

export class EnableMfaDto {
  @ApiProperty({ example: '123456', description: 'First TOTP code to confirm setup' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'TOTP must be exactly 6 digits' })
  totpCode: string;
}

export class UseBackupCodeDto {
  @ApiProperty({ description: 'Temporary token from internal login step' })
  @IsString() @IsNotEmpty()
  tempToken: string;

  @ApiProperty({ example: 'ABCD-EFGH-1234', description: 'One-time backup code' })
  @IsString() @IsNotEmpty()
  backupCode: string;
}

// ─── SHARED DTOs ────────────────────────────────────────────────────

export * from './first-login-password-change.dto';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@acme.com', description: 'Email (client) or username@internal.hariventure.com (internal)' })
  @IsString() @IsNotEmpty()
  identifier: string; // email for clients, username for internal
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token from email' })
  @IsString() @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewSecurePass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}

export class RefreshTokenDto {
  // refreshToken is sent via httpOnly cookie, not body
  // This DTO exists for Swagger documentation only
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123!' })
  @IsString() @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecurePass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}

export class AdminResetMfaDto {
  @ApiProperty({ description: 'User ID to reset MFA for (CEO only)' })
  @IsString() @IsNotEmpty()
  userId: string;
}
