import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('projects')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  update(@Param('id') id: string, @Body() updateProjectDto: any) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
