import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Razorpay = require('razorpay');
import * as crypto from 'crypto';
import PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';

import { Invoice, InvoiceDocument } from '../../database/schemas/invoice.schema';
import { Payment, PaymentDocument } from '../../database/schemas/payment.schema';
import { Counter, CounterDocument } from '../../database/schemas/counter.schema';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { Project, ProjectDocument } from '../../database/schemas/project.schema';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class BillingService {
  private razorpay: any;

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly auditService: AuditService,
    private configService: ConfigService,
  ) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID') || 'dummy_key';
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy_secret';
    
    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }

  private async getNextSequence(name: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return counter.seq;
  }

  // --------------------------------------------------------------------------
  // HR ACTIONS
  // --------------------------------------------------------------------------

  async createInvoice(userId: string, data: any) {
    const seq = await this.getNextSequence('invoiceId');
    const invoiceNumber = `INV${seq.toString().padStart(6, '0')}`;

    const newInvoice = await this.invoiceModel.create({
      invoiceNumber,
      projectId: data.projectId,
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      amount: data.amount,
      currency: data.currency || 'INR',
      status: 'PENDING',
      dueDate: new Date(data.dueDate),
      createdBy: userId as any,
    });

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.INVOICE_CREATED as any,
      module: 'billing',
      metadata: { invoiceId: newInvoice._id, invoiceNumber },
    });

    return newInvoice;
  }

  async updateInvoice(userId: string, id: string, data: any) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (invoice.status !== 'DRAFT' && invoice.status !== 'PENDING') {
      throw new BadRequestException('Cannot edit an active or paid invoice');
    }

    Object.assign(invoice, data);
    await invoice.save();

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.INVOICE_UPDATED as any,
      module: 'billing',
      metadata: { invoiceId: invoice._id },
    });

    return invoice;
  }

  async cancelInvoice(userId: string, id: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Cannot cancel a paid invoice');
    }

    invoice.status = 'CANCELLED';
    await invoice.save();

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.INVOICE_CANCELLED as any,
      module: 'billing',
      metadata: { invoiceId: invoice._id },
    });

    return invoice;
  }

  async getAllInvoices() {
    return this.invoiceModel.find().sort({ createdAt: -1 }).lean();
  }

  async getAllPayments() {
    return this.paymentModel.find().sort({ createdAt: -1 }).lean();
  }

  // --------------------------------------------------------------------------
  // CLIENT ACTIONS
  // --------------------------------------------------------------------------

  private async getClientByUserId(userId: string): Promise<ClientDocument> {
    const client = await this.clientModel.findOne({ userId });
    if (!client) throw new NotFoundException('Client profile not found');
    return client;
  }

  async getClientInvoices(userId: string) {
    const client = await this.getClientByUserId(userId);
    return this.invoiceModel.find({ clientId: client._id }).sort({ createdAt: -1 }).lean();
  }

  async getClientInvoice(userId: string, id: string) {
    const client = await this.getClientByUserId(userId);
    const invoice = await this.invoiceModel.findOne({ _id: id, clientId: client._id }).lean();
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async getClientPayments(userId: string) {
    const client = await this.getClientByUserId(userId);
    return this.paymentModel.find({ clientId: client._id }).sort({ createdAt: -1 }).lean();
  }

  // --------------------------------------------------------------------------
  // RAZORPAY INTEGRATION
  // --------------------------------------------------------------------------

  async initiatePayment(userId: string, invoiceId: string) {
    const client = await this.getClientByUserId(userId);
    const invoice = await this.invoiceModel.findOne({ _id: invoiceId, clientId: client._id });
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    // Razorpay amount is in paise
    const amountInSmallestUnit = Math.round(invoice.amount * 100);

    let order;
    try {
      order = await this.razorpay.orders.create({
        amount: amountInSmallestUnit,
        currency: invoice.currency,
        receipt: invoice.invoiceNumber,
        notes: {
          invoiceId: invoice._id.toString(),
          clientId: client._id.toString(),
        }
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to create Razorpay order');
    }

    const seq = await this.getNextSequence('paymentId');
    const paymentNumber = `PAY${seq.toString().padStart(6, '0')}`;

    const payment = await this.paymentModel.create({
      paymentNumber,
      invoiceId: invoice._id,
      projectId: invoice.projectId,
      clientId: client._id,
      amount: invoice.amount,
      currency: invoice.currency,
      status: 'PENDING',
      razorpayOrderId: order.id,
    });

    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.PAYMENT_INITIATED as any,
      module: 'billing',
      metadata: { invoiceId, paymentId: payment._id, orderId: order.id },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: this.configService.get<string>('RAZORPAY_KEY_ID'),
    };
  }

  // --------------------------------------------------------------------------
  // WEBHOOK VERIFICATION & RECEIPT GENERATION
  // --------------------------------------------------------------------------

  async handleWebhook(body: any, signature: string) {
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || 'dummy_webhook_secret';
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid signature');
    }

    const eventName = body.event;
    if (eventName === 'payment.captured') {
      const paymentEntity = body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const payment = await this.paymentModel.findOne({ razorpayOrderId: orderId });
      if (!payment) return { success: false, message: 'Payment not found' };

      if (payment.status === 'SUCCESS') return { success: true, message: 'Already processed' };

      payment.status = 'SUCCESS';
      payment.razorpayPaymentId = paymentId;
      payment.razorpaySignature = signature;
      payment.paidAt = new Date();
      
      const receiptFilename = `${payment.paymentNumber}.pdf`;
      const receiptsDir = path.join(process.cwd(), 'uploads', 'receipts');
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }
      
      const receiptPath = path.join(receiptsDir, receiptFilename);
      await this.generatePdfReceipt(payment, receiptPath);
      
      payment.receiptUrl = `/uploads/receipts/${receiptFilename}`;
      await payment.save();

      const invoice = await this.invoiceModel.findById(payment.invoiceId);
      if (invoice) {
        invoice.status = 'PAID';
        await invoice.save();
      }

      await this.auditService.logEvent({
        userId: payment.clientId.toString(),
        role: 'SYSTEM' as any,
        action: AuditEvent.PAYMENT_SUCCESS as any,
        module: 'billing',
        metadata: { paymentId: payment._id, invoiceId: payment.invoiceId },
      });
    } else if (eventName === 'payment.failed') {
      const paymentEntity = body.payload.payment.entity;
      const orderId = paymentEntity.order_id;

      const payment = await this.paymentModel.findOne({ razorpayOrderId: orderId });
      if (payment) {
        payment.status = 'FAILED';
        await payment.save();

        await this.auditService.logEvent({
          userId: payment.clientId.toString(),
          role: 'SYSTEM' as any,
          action: AuditEvent.PAYMENT_FAILED as any,
          module: 'billing',
          metadata: { paymentId: payment._id },
        });
      }
    }

    return { success: true };
  }

  private generatePdfReceipt(payment: PaymentDocument, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      doc.fontSize(20).text('Payment Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Receipt No: ${payment.paymentNumber}`);
      doc.text(`Date: ${payment.paidAt?.toLocaleDateString()}`);
      doc.text(`Transaction ID: ${payment.razorpayPaymentId}`);
      doc.text(`Amount Paid: ${payment.currency} ${payment.amount}`);
      doc.text(`Status: SUCCESS`);
      doc.moveDown();
      doc.text('Thank you for your business!');

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

  async downloadReceipt(userId: string, receiptId: string) {
    const client = await this.getClientByUserId(userId);
    const payment = await this.paymentModel.findOne({ _id: receiptId, clientId: client._id });
    if (!payment) throw new NotFoundException('Receipt not found or access denied');
    if (!payment.receiptUrl) throw new NotFoundException('Receipt file not generated yet');
    
    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.RECEIPT_DOWNLOADED as any,
      module: 'billing',
      metadata: { paymentId: payment._id },
    });

    return payment.receiptUrl;
  }
}
