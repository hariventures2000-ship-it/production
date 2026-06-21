import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // --------------------------------------------------------------------------
  // HR ENDPOINTS
  // --------------------------------------------------------------------------

  @ApiTags('Internal Billing')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Post('v1/billing/invoices')
  @ApiOperation({ summary: 'Create an invoice' })
  createInvoice(@Req() req: any, @Body() body: any) {
    return this.billingService.createInvoice(req.user.sub, body);
  }

  @ApiTags('Internal Billing')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Patch('v1/billing/invoices/:id')
  @ApiOperation({ summary: 'Update an invoice' })
  updateInvoice(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.billingService.updateInvoice(req.user.sub, id, body);
  }

  @ApiTags('Internal Billing')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get('v1/billing/invoices')
  @ApiOperation({ summary: 'List all invoices' })
  getAllInvoices() {
    return this.billingService.getAllInvoices();
  }

  @ApiTags('Internal Billing')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get('v1/billing/payments')
  @ApiOperation({ summary: 'List all payments' })
  getAllPayments() {
    return this.billingService.getAllPayments();
  }

  @ApiTags('Internal Billing')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Patch('v1/billing/invoices/:id/cancel')
  @ApiOperation({ summary: 'Cancel an invoice' })
  cancelInvoice(@Req() req: any, @Param('id') id: string) {
    return this.billingService.cancelInvoice(req.user.sub, id);
  }

  // --------------------------------------------------------------------------
  // CLIENT ENDPOINTS
  // --------------------------------------------------------------------------

  @ApiTags('Client Billing')
  @Roles(Role.CLIENT)
  @Get('v1/client/billing/invoices')
  @ApiOperation({ summary: 'List own invoices' })
  getClientInvoices(@Req() req: any) {
    return this.billingService.getClientInvoices(req.user.sub);
  }

  @ApiTags('Client Billing')
  @Roles(Role.CLIENT)
  @Get('v1/client/billing/payments')
  @ApiOperation({ summary: 'List own payments' })
  getClientPayments(@Req() req: any) {
    return this.billingService.getClientPayments(req.user.sub);
  }

  @ApiTags('Client Billing')
  @Roles(Role.CLIENT)
  @Get('v1/client/billing/invoices/:id')
  @ApiOperation({ summary: 'Invoice details' })
  getClientInvoice(@Req() req: any, @Param('id') id: string) {
    return this.billingService.getClientInvoice(req.user.sub, id);
  }

  @ApiTags('Client Billing')
  @Roles(Role.CLIENT)
  @Post('v1/client/billing/invoices/:id/pay')
  @ApiOperation({ summary: 'Initiate payment' })
  initiatePayment(@Req() req: any, @Param('id') id: string) {
    return this.billingService.initiatePayment(req.user.sub, id);
  }

  @ApiTags('Client Billing')
  @Roles(Role.CLIENT)
  @Get('v1/client/billing/receipts/:id')
  @ApiOperation({ summary: 'Download receipt' })
  downloadReceipt(@Req() req: any, @Param('id') id: string) {
    return this.billingService.downloadReceipt(req.user.sub, id);
  }
}
