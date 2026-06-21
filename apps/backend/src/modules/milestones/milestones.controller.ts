import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('milestones')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.create(createMilestoneDto);
  }

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  findAll(@Query('projectId') projectId?: string) {
    if (projectId) {
      return this.milestonesService.findByProject(projectId);
    }
    return this.milestonesService.findAll();
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  findOne(@Param('id') id: string) {
    return this.milestonesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.milestonesService.update(id, updateData);
  }

  @Patch(':id/complete')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  complete(@Param('id') id: string) {
    return this.milestonesService.complete(id);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  remove(@Param('id') id: string) {
    return this.milestonesService.remove(id);
  }
}
