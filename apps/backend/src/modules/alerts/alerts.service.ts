import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const resendKey = this.configService.get<string>('RESEND_API_KEY');
    if (resendKey && resendKey !== 'mock') {
      this.resend = new Resend(resendKey);
    }
  }

  async triggerSecurityAlert(title: string, details: string) {
    this.logger.error(`🚨 SECURITY ALERT: ${title} - ${details}`);
    
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: 'Hariventure Security <security@hariventure.com>',
          to: ['admin@hariventure.com'],
          subject: `[CRITICAL] Security Alert: ${title}`,
          html: `<h1>Security Anomaly Detected</h1><p>${details}</p>`
        });
      } catch (err) {
        this.logger.error('Failed to send security alert email', err);
      }
    }
  }

  async triggerDeliveryAlert(title: string, details: string) {
    this.logger.warn(`⚠️ DELIVERY ALERT: ${title} - ${details}`);

    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: 'Hariventure Operations <ops@hariventure.com>',
          to: ['md@hariventure.com', 'ceo@hariventure.com'],
          subject: `[ACTION REQUIRED] Delivery Alert: ${title}`,
          html: `<h1>Delivery Escalation</h1><p>${details}</p>`
        });
      } catch (err) {
        this.logger.error('Failed to send delivery alert email', err);
      }
    }
  }
}
