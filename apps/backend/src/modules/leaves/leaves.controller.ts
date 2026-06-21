import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('leaves')
@UseGuards(JwtAuthGuard, RbacGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  @Roles(Role.EMPLOYEE, Role.TEAM_LEAD)
  create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leavesService.create(createLeaveDto);
  }

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD, Role.EMPLOYEE)
  findAll() {
    return this.leavesService.findAll();
  }

  @Get('my-leaves')
  @Roles(Role.EMPLOYEE, Role.TEAM_LEAD)
  findMyLeaves(@Request() req: any) {
    return this.leavesService.findByEmployee(req.user.userId);
  }

  @Get('pending')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  findPending() {
    return this.leavesService.findPending();
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD, Role.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.leavesService.findOne(id);
  }

  @Patch(':id/approve')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  approve(@Param('id') id: string, @Request() req: any) {
    return this.leavesService.approve(id, req.user.userId);
  }

  @Patch(':id/reject')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  reject(@Param('id') id: string, @Body('reason') reason: string, @Request() req: any) {
    return this.leavesService.reject(id, reason, req.user.userId);
  }

  @Patch(':id/cancel')
  @Roles(Role.EMPLOYEE, Role.TEAM_LEAD)
  cancel(@Param('id') id: string) {
    return this.leavesService.cancel(id);
  }
}
