import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuditService } from '../../modules/audit/audit.service';
import { AlertsService } from '../../modules/alerts/alerts.service';
import { AuditEvent } from '../../modules/audit/enums/audit-event.enum';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  constructor(
    private auditService: AuditService,
    private alertsService: AlertsService
  ) {}

  async catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const userId = (request as any).user?.sub || 'unauthenticated';

    // Log the Abuse
    await this.auditService.logEvent({
      userId: userId !== 'unauthenticated' ? userId : undefined,
      action: AuditEvent.THROTTLE_ABUSE_DETECTED,
      module: 'security',
      ipAddress: ip,
      metadata: { path: request.url, method: request.method }
    });

    // Trigger Alert
    await this.alertsService.triggerSecurityAlert(
      'Rate Limit Abuse', 
      `IP ${ip} (User: ${userId}) exceeded rate limits on path ${request.url}`
    );

    response.status(429).json({
      statusCode: 429,
      message: 'Too Many Requests',
      error: 'ThrottlerException'
    });
  }
}
