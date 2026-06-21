import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('teams')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE)
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('my-team')
  @Roles(Role.TEAM_LEAD, Role.EMPLOYEE)
  findMyTeam(@Request() req: any) {
    return this.teamsService.findMyTeam(req.user.userId);
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/workload')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  getWorkload(@Param('id') id: string) {
    return this.teamsService.getTeamWorkload(id);
  }

  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.teamsService.update(id, updateData);
  }

  @Post(':id/members')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  addMember(@Param('id') id: string, @Body('userId') userId: string) {
    return this.teamsService.addMember(id, userId);
  }

  @Delete(':id/members/:userId')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.teamsService.removeMember(id, userId);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
