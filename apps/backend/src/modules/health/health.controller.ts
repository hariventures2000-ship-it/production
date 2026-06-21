import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Public health check (does not leak infrastructure details)' })
  check() {
    return { status: 'ok' };
  }

  @Get('db')
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @HealthCheck()
  @ApiOperation({ summary: 'Restricted database health check' })
  checkDatabase() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb'),
    ]);
  }
}
