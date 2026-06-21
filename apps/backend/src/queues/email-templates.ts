// ═══════════════════════════════════════════════════════════════════
// Email Templates — Hariventure Digital Production
// Used by the BullMQ email processor
// ═══════════════════════════════════════════════════════════════════

const BRAND_COLOR = '#6366F1';
const BRAND_NAME = 'Hariventure Digital Production';

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:${BRAND_COLOR};padding:28px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">${BRAND_NAME}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">
              © ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.<br/>
              This is an automated email — please do not reply.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface VerificationEmailData {
  name: string;
  token: string;
}

export interface OtpEmailData {
  name: string;
  otp: string;
  expiresInMinutes: number;
}

export interface PasswordResetEmailData {
  name: string;
  token: string;
  authType: string;
}

export interface WelcomeEmailData {
  name: string;
  role: string;
}

export function buildVerificationEmail(frontendUrl: string, data: VerificationEmailData): { subject: string; html: string } {
  const url = `${frontendUrl}/auth/client/verify-email?token=${data.token}`;
  return {
    subject: 'Verify your email — Hariventure',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Welcome, ${data.name}! 👋</h2>
      <p style="margin:0 0 24px;color:#4B5563;line-height:1.6;">
        Thank you for registering with ${BRAND_NAME}. To complete your registration,
        please verify your email address by clicking the button below.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
          Verify Email Address
        </a>
      </div>
      <p style="margin:24px 0 0;color:#9CA3AF;font-size:13px;">
        This link expires in 24 hours. If you did not create this account, you can safely ignore this email.
      </p>
    `),
  };
}

export function buildOtpEmail(data: OtpEmailData): { subject: string; html: string } {
  return {
    subject: `${data.otp} — Your Hariventure login code`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Your Login Code</h2>
      <p style="margin:0 0 24px;color:#4B5563;line-height:1.6;">
        Hi ${data.name}, use the following one-time code to complete your login.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <div style="display:inline-block;background:#F3F4F6;border:2px dashed ${BRAND_COLOR};border-radius:12px;padding:20px 48px;">
          <span style="font-size:42px;font-weight:700;color:${BRAND_COLOR};letter-spacing:8px;">${data.otp}</span>
        </div>
      </div>
      <p style="margin:0;color:#6B7280;font-size:13px;text-align:center;">
        This code expires in <strong>${data.expiresInMinutes} minutes</strong>. Do not share it with anyone.
      </p>
    `),
  };
}

export function buildPasswordResetEmail(frontendUrl: string, data: PasswordResetEmailData): { subject: string; html: string } {
  const path = data.authType === 'CLIENT'
    ? '/auth/client/reset-password'
    : '/auth/internal/reset-password';
  const url = `${frontendUrl}${path}?token=${data.token}`;
  return {
    subject: 'Reset your password — Hariventure',
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Password Reset Request</h2>
      <p style="margin:0 0 24px;color:#4B5563;line-height:1.6;">
        Hi ${data.name}, we received a request to reset your password. Click the button below to proceed.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${url}" style="display:inline-block;background:#DC2626;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
          Reset Password
        </a>
      </div>
      <p style="margin:24px 0 0;color:#9CA3AF;font-size:13px;">
        This link expires in 1 hour. If you did not request a password reset, please contact support immediately.
      </p>
    `),
  };
}

export function buildWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string } {
  return {
    subject: `Welcome to ${BRAND_NAME}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Welcome aboard, ${data.name}! 🚀</h2>
      <p style="margin:0 0 24px;color:#4B5563;line-height:1.6;">
        Your internal account has been created with the role of <strong>${data.role}</strong>.
        Your credentials will be provided separately by HR.
      </p>
      <p style="margin:0;color:#4B5563;line-height:1.6;">
        Access the platform at <a href="${process.env.FRONTEND_URL}" style="color:${BRAND_COLOR};">
        ${process.env.FRONTEND_URL}</a> and follow the MFA setup instructions on your first login.
      </p>
    `),
  };
}

export interface ClientOnboardingEmailData {
  name: string;
  clientId: string;
  tempPassword: string;
}

export function buildClientOnboardingEmail(frontendUrl: string, data: ClientOnboardingEmailData): { subject: string; html: string } {
  const url = `${frontendUrl}/auth/client/login`;
  return {
    subject: `Your Client Portal Access — ${BRAND_NAME}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Welcome, ${data.name}! 👋</h2>
      <p style="margin:0 0 24px;color:#4B5563;line-height:1.6;">
        Your project request has been approved and your client account has been created.
      </p>
      <div style="background:#F3F4F6;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 8px;color:#4B5563;"><strong>Client ID:</strong> ${data.clientId}</p>
        <p style="margin:0;color:#4B5563;"><strong>Temporary Password:</strong> ${data.tempPassword}</p>
      </div>
      <p style="margin:0 0 24px;color:#4B5563;line-height:1.6;">
        You will be required to change your password upon your first login.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
          Login to Client Portal
        </a>
      </div>
    `),
  };
}
