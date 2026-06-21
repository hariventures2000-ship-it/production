import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('v1/webhooks/razorpay')
@ApiTags('Webhooks')
export class BillingWebhookController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Razorpay Webhook endpoint' })
  async handleRazorpayWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: any,
  ) {
    if (!signature) {
      return { success: false, message: 'Missing signature' };
    }
    return this.billingService.handleWebhook(body, signature);
  }
}
