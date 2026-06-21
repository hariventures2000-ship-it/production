import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { Resend } from 'resend';
import {
  buildVerificationEmail,
  buildOtpEmail,
  buildPasswordResetEmail,
  buildWelcomeEmail,
  VerificationEmailData,
  OtpEmailData,
  PasswordResetEmailData,
  WelcomeEmailData,
  ClientOnboardingEmailData,
  buildClientOnboardingEmail,
} from './email-templates';

// ═══════════════════════════════════════════════════════════════════
// Email Queue Processor — Hariventure Digital Production
//
// Handles all outbound emails via Resend.
// In development (NODE_ENV !== 'production'), emails are logged to
// console instead of sent — this is a valid dev configuration, not
// a mock. Set RESEND_API_KEY to enable live sending in any environment.
// ═══════════════════════════════════════════════════════════════════

export type EmailJobName =
  | 'send-verification-email'
  | 'send-otp-email'
  | 'send-password-reset-email'
  | 'send-welcome-email'
  | 'send-client-onboarding-email';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly frontendUrl: string;
  private readonly isDev: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY');
    this.isDev = config.get<string>('NODE_ENV', 'development') !== 'production';
    this.frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    this.fromEmail = config.get<string>('RESEND_FROM_EMAIL', 'noreply@hariventure.com');
    this.fromName = config.get<string>('RESEND_FROM_NAME', 'Hariventure Digital Production');

    // In development mode, always bypass Resend to print OTPs to console
    this.resend = (apiKey && !this.isDev) ? new Resend(apiKey) : null;

    if (!this.resend) {
      this.logger.warn(
        'Email sending bypassed (dev mode or no API key). Emails will be logged to console.',
      );
    }
  }

  @Process('send-verification-email')
  async handleVerificationEmail(job: Job<VerificationEmailData & { to: string }>) {
    const { to, name, token } = job.data;
    const { subject, html } = buildVerificationEmail(this.frontendUrl, { name, token });
    await this.send(to, subject, html, job.name);
  }

  @Process('send-otp-email')
  async handleOtpEmail(job: Job<OtpEmailData & { to: string }>) {
    const { to, name, otp, expiresInMinutes } = job.data;
    const { subject, html } = buildOtpEmail({ name, otp, expiresInMinutes });
    
    // Always print OTP in dev mode, BEFORE attempting to send, so if Resend fails, we still have it
    if (this.isDev || !this.resend) {
      this.logger.log(`\n=========================================\n[DEV] OTP for ${to}: ${otp}\n=========================================\n`);
    }

    await this.send(to, subject, html, job.name);
  }

  @Process('send-password-reset-email')
  async handlePasswordResetEmail(
    job: Job<PasswordResetEmailData & { to: string }>,
  ) {
    const { to, name, token, authType } = job.data;
    const { subject, html } = buildPasswordResetEmail(this.frontendUrl, { name, token, authType });
    await this.send(to, subject, html, job.name);
  }

  @Process('send-welcome-email')
  async handleWelcomeEmail(job: Job<WelcomeEmailData & { to: string }>) {
    const { to, name, role } = job.data;
    const { subject, html } = buildWelcomeEmail({ name, role });
    await this.send(to, subject, html, job.name);
  }

  @Process('send-client-onboarding-email')
  async handleClientOnboardingEmail(job: Job<ClientOnboardingEmailData & { to: string }>) {
    const { to, name, clientId, tempPassword } = job.data;
    const { subject, html } = buildClientOnboardingEmail(this.frontendUrl, { name, clientId, tempPassword });
    await this.send(to, subject, html, job.name);
  }

  // ─── PRIVATE ────────────────────────────────────────────────────

  private async send(
    to: string,
    subject: string,
    html: string,
    jobName: string,
  ): Promise<void> {
    if (!this.resend) {
      this.logger.log(
        `[DEV EMAIL] Job: ${jobName} | To: ${to} | Subject: ${subject}`,
      );
      return;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        subject,
        html,
      });

      if (error) {
        throw new Error(`Resend error: ${JSON.stringify(error)}`);
      }

      this.logger.log(`Email sent: ${jobName} → ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send ${jobName} to ${to}:`, (err as Error).message);
      throw err; // Re-throw so BullMQ retries (max 3 attempts, exponential backoff)
    }
  }
}
