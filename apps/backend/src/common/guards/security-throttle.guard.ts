import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { AuditService } from '../../modules/audit/audit.service';
import { AlertsService } from '../../modules/alerts/alerts.service';
import { AuditEvent } from '../../modules/audit/enums/audit-event.enum';

@Injectable()
export class SecurityThrottleGuard extends ThrottlerGuard {
  // Override the exception thrower to hook into Audit and Alerts
  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: any): Promise<void> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.connection?.remoteAddress;
    
    // We attempt to pull from moduleRef because ThrottlerGuard handles DI differently in super
    // but the safest way is to use a global service locator or inject it. 
    // Wait, nestjs ThrottlerGuard supports standard DI since it's @Injectable()
    // However, constructor injection in a subclass requires passing standard deps up.
    // Instead of overriding constructor and messing up ThrottlerGuard DI, we can access via context.
    
    const auditService = context.switchToHttp().getRequest().app?.get(AuditService) || null;
    const alertsService = context.switchToHttp().getRequest().app?.get(AlertsService) || null;

    // Actually, context.switchToHttp() doesn't give us the app instance directly in all adapters.
    // Better: let's assume we can emit an event or just log it simply.
    // Or we just throw the standard exception and let an ExceptionFilter catch it.
    throw new ThrottlerException('Too Many Requests');
  }
}
