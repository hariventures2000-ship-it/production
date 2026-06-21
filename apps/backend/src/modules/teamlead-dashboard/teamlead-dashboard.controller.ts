import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TeamleadDashboardService } from './teamlead-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('teamlead')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles(Role.TEAM_LEAD, Role.CEO, Role.MANAGING_DIRECTOR)
export class TeamleadDashboardController {
  constructor(
    private readonly teamleadDashboardService: TeamleadDashboardService,
  ) {}

  @Get('overview')
  getOverview(@Request() req: any) {
    return this.teamleadDashboardService.getOverview(req.user.userId);
  }

  @Get('my-projects')
  getMyProjects(@Request() req: any) {
    return this.teamleadDashboardService.getMyProjects(req.user.userId);
  }

  @Get('my-team')
  getMyTeam(@Request() req: any) {
    return this.teamleadDashboardService.getMyTeam(req.user.userId);
  }

  @Get('pending-leaves')
  getPendingLeaves(@Request() req: any) {
    return this.teamleadDashboardService.getPendingLeaves(req.user.userId);
  }
}
