import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyticsSnapshot, AnalyticsSnapshotDocument } from '../../database/schemas/analytics-snapshot.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Analytics')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('v1/analytics')
// Required Throttling for Analytics Endpoints
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class AnalyticsController {
  constructor(
    @InjectModel(AnalyticsSnapshot.name) private snapshotModel: Model<AnalyticsSnapshotDocument>,
  ) {}

  @Get('ceo-dashboard')
  @Roles(Role.CEO)
  @ApiOperation({ summary: 'Get CEO Analytics Snapshot' })
  async getCeoDashboard() {
    const snapshot = await this.snapshotModel.findOne().lean();
    return snapshot ? { metadata: { version: snapshot.version, generatedAt: snapshot.generatedAt }, ceo: snapshot.ceo, security: snapshot.security } : {};
  }

  @Get('md-dashboard')
  @Roles(Role.MANAGING_DIRECTOR, Role.CEO)
  @ApiOperation({ summary: 'Get MD Analytics Snapshot' })
  async getMdDashboard() {
    const snapshot = await this.snapshotModel.findOne().lean();
    return snapshot ? { metadata: { version: snapshot.version, generatedAt: snapshot.generatedAt }, md: snapshot.md } : {};
  }

  @Get('audit-overview')
  @Roles(Role.CEO)
  @ApiOperation({ summary: 'Get Audit & Security Overview Snapshot' })
  async getAuditOverview() {
    const snapshot = await this.snapshotModel.findOne().lean();
    return snapshot ? { metadata: { version: snapshot.version, generatedAt: snapshot.generatedAt }, security: snapshot.security } : {};
  }
}
