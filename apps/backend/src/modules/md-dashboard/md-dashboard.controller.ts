import { Controller, Get, UseGuards } from '@nestjs/common';
import { MdDashboardService } from './md-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('md')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles(Role.CEO, Role.MANAGING_DIRECTOR)
export class MdDashboardController {
  constructor(private readonly mdDashboardService: MdDashboardService) {}

  @Get('overview')
  getOverview() {
    return this.mdDashboardService.getOverview();
  }

  @Get('projects')
  getProjects() {
    return this.mdDashboardService.getProjects();
  }

  @Get('workforce')
  getWorkforce() {
    return this.mdDashboardService.getWorkforce();
  }

  @Get('budget-summary')
  getBudgetSummary() {
    return this.mdDashboardService.getBudgetSummary();
  }
}
