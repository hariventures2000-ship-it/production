import {
  Controller, Post, Get, Body, Patch, Req, Res, Ip, Delete,
  HttpCode, HttpStatus, UseGuards, Param, UnauthorizedException, ForbiddenException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RbacGuard } from './guards/rbac.guard';
import { Roles, Public } from './decorators/roles.decorator';
import { SkipCsrf } from './decorators/skip-csrf.decorator';
import * as crypto from 'crypto';
import { Role } from '@hariventure/types';
import {
  ClientRegisterDto, ClientLoginDto, VerifyEmailDto, VerifyClientOtpDto, ResendOtpDto,
  InternalLoginDto, VerifyTotpDto, EnableMfaDto, UseBackupCodeDto,
  ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, AdminResetMfaDto, FirstLoginPasswordChangeDto
} from './dto/auth.dto';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

const ROUTE_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches refreshToken)
  path: '/',
};

const TEMP_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 10 * 60 * 1000, // 10 minutes
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService
  ) {}

  // ═══════════════════════════════════════════════════════════════════
  // CSRF & SESSIONS
  // ═══════════════════════════════════════════════════════════════════

  @Public()
  @SkipCsrf()
  @Get('csrf')
  @ApiOperation({ summary: 'Get CSRF token' })
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false, // Must be readable by Axios
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return { csrfToken };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'List active sessions' })
  async getSessions(@Req() req: any) {
    return this.sessionService.getActiveSessions(req.user.sub);
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Revoke a specific session' })
  async revokeSession(@Param('sessionId') sessionId: string, @Req() req: any, @Ip() ip: string) {
    // Verify session ownership
    const sessions = await this.sessionService.getActiveSessions(req.user.sub);
    const ownsSession = sessions.some(s => s.sessionId === sessionId);
    if (!ownsSession) throw new ForbiddenException('Cannot revoke session belonging to another user');
    
    await this.sessionService.revokeSession(sessionId, req.user.sub, { ip, userAgent: req.headers['user-agent'] });
    return { message: 'Session revoked successfully' };
  }

  // ═══════════════════════════════════════════════════════════════════
  // CLIENT AUTH
  // ═══════════════════════════════════════════════════════════════════

  @Public()
  @SkipCsrf()
  @Post('client/register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register new client account' })
  @HttpCode(HttpStatus.CREATED)
  async clientRegister(@Body() dto: ClientRegisterDto) {
    return this.authService.clientRegister(dto);
  }

  @Public()
  @SkipCsrf()
  @Post('client/verify-email')
  @ApiOperation({ summary: 'Verify client email with token from link' })
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @SkipCsrf()
  @Post('client/login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Client login — sends OTP to email' })
  @HttpCode(HttpStatus.OK)
  async clientLogin(@Body() dto: ClientLoginDto, @Ip() ip: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.clientLogin(dto, ip || '127.0.0.1');
    res.cookie('otpTempToken', result.tempToken, TEMP_COOKIE_OPTIONS);
    return {
      requiresOtp: result.requiresOtp,
      maskedEmail: result.maskedEmail,
    };
  }

  @Public()
  @SkipCsrf()
  @Post('client/verify-otp')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify client OTP — issues JWT tokens' })
  @HttpCode(HttpStatus.OK)
  async verifyClientOtp(
    @Req() req: Request,
    @Body() dto: VerifyClientOtpDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tempToken = req.cookies?.otpTempToken;
    if (!tempToken) throw new UnauthorizedException('OTP session expired or not found');

    const result = await this.authService.verifyClientOtp(dto, tempToken, ip || '127.0.0.1');
    res.clearCookie('otpTempToken', { path: '/' });
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    res.cookie('routeSessionToken', (result.tokens as any).routeSessionToken, ROUTE_SESSION_COOKIE_OPTIONS);
    return { accessToken: result.tokens.accessToken, expiresIn: result.tokens.expiresIn, user: result.user };
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(Role.CLIENT)
  @Patch('client/first-login-password-change')
  @ApiOperation({ summary: 'Force client to change password on first login' })
  @HttpCode(HttpStatus.OK)
  async firstLoginPasswordChange(@Req() req: Request, @Body() dto: FirstLoginPasswordChangeDto) {
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    return this.authService.firstLoginPasswordChange((req as any).user.sub, dto.newPassword, ip);
  }

  // ═══════════════════════════════════════════════════════════════════
  // INTERNAL AUTH
  // ═══════════════════════════════════════════════════════════════════

  @Public()
  @SkipCsrf()
  @Post('internal/login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Internal user login — username + password' })
  @HttpCode(HttpStatus.OK)
  async internalLogin(@Body() dto: InternalLoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.internalLogin(dto);
    res.cookie('mfaTempToken', result.tempToken, TEMP_COOKIE_OPTIONS);
    return {
      requiresMfa: result.requiresMfa,
      requiresMfaSetup: result.requiresMfaSetup,
    };
  }

  @Public()
  @SkipCsrf()
  @Post('internal/mfa/setup')
  @ApiOperation({ summary: 'Get TOTP QR code for Microsoft Authenticator setup' })
  @HttpCode(HttpStatus.OK)
  async setupMfa(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tempToken = req.cookies?.mfaTempToken;
    if (!tempToken) throw new UnauthorizedException('MFA session expired');

    const result = await this.authService.setupMfa(tempToken);
    res.cookie('mfaTempToken', result.tempToken, TEMP_COOKIE_OPTIONS);
    return {
      qrCodeUri: result.qrCodeUri,
      qrCodeImage: result.qrCodeImage,
      manualEntryKey: result.manualEntryKey,
      instructions: result.instructions,
    };
  }

  @Public()
  @SkipCsrf()
  @Post('internal/mfa/enable')
  @ApiOperation({ summary: 'Confirm TOTP code and activate MFA' })
  @HttpCode(HttpStatus.OK)
  async enableMfa(@Req() req: Request, @Body() dto: EnableMfaDto, @Res({ passthrough: true }) res: Response) {
    const tempToken = req.cookies?.mfaTempToken;
    if (!tempToken) throw new UnauthorizedException('MFA session expired');

    const result = await this.authService.enableMfa(dto, tempToken);
    res.clearCookie('mfaTempToken', { path: '/' });
    return result;
  }

  @Public()
  @SkipCsrf()
  @Post('internal/mfa/verify')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify TOTP code from Microsoft Authenticator — issues JWT tokens' })
  @HttpCode(HttpStatus.OK)
  async verifyTotp(
    @Req() req: Request,
    @Body() dto: VerifyTotpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tempToken = req.cookies?.mfaTempToken;
    if (!tempToken) throw new UnauthorizedException('MFA session expired');

    const result = await this.authService.verifyTotp(dto, tempToken);
    res.clearCookie('mfaTempToken', { path: '/' });
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    return { accessToken: result.tokens.accessToken, expiresIn: result.tokens.expiresIn, user: result.user };
  }

  @Public()
  @SkipCsrf()
  @Post('internal/mfa/backup')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Use one-time backup code for MFA recovery' })
  @HttpCode(HttpStatus.OK)
  async useBackupCode(
    @Body() dto: UseBackupCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.useBackupCode(dto);
    res.cookie('refreshToken', (result as any).tokens.refreshToken, COOKIE_OPTIONS);
    return { accessToken: (result as any).tokens.accessToken, user: (result as any).user };
  }

  // CEO: Reset MFA for internal user
  @Post('internal/mfa/admin-reset')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(Role.CEO)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'CEO: Reset MFA for an internal user' })
  @HttpCode(HttpStatus.OK)
  async adminResetMfa(@Req() req: Request, @Body() dto: AdminResetMfaDto) {
    return this.authService.adminResetMfa((req as any).user.sub, dto.userId);
  }

  // ═══════════════════════════════════════════════════════════════════
  // SHARED ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using httpOnly cookie' })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const tokens = await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    res.cookie('routeSessionToken', tokens.routeSessionToken, ROUTE_SESSION_COOKIE_OPTIONS);
    return { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Logout and invalidate tokens' })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Ip() ip: string) {
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('routeSessionToken', { path: '/' });
    res.clearCookie('routeSessionToken', { path: '/' });
    return this.authService.logout((req as any).user.sub, ip, req.headers['user-agent']);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Logout from all devices' })
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Ip() ip: string) {
    res.clearCookie('refreshToken', { path: '/' });
    return this.authService.logoutAll((req as any).user.sub, ip, req.headers['user-agent']);
  }

  @Public()
  @SkipCsrf()
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Request password reset email' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @SkipCsrf()
  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password with token from email' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Change own password' })
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword((req as any).user.sub, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get current authenticated user' })
  async getMe(@Req() req: Request) {
    return this.authService.getMe((req as any).user.sub);
  }
}
