import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('sprints')
@UseGuards(JwtAuthGuard, RbacGuard)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintsService.create(createSprintDto);
  }

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE)
  findAll(@Query('projectId') projectId?: string) {
    if (projectId) {
      return this.sprintsService.findByProject(projectId);
    }
    return this.sprintsService.findAll();
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.sprintsService.update(id, updateData);
  }

  @Patch(':id/activate')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  activate(@Param('id') id: string) {
    return this.sprintsService.activate(id);
  }

  @Patch(':id/complete')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  complete(@Param('id') id: string) {
    return this.sprintsService.complete(id);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  remove(@Param('id') id: string) {
    return this.sprintsService.remove(id);
  }
}
