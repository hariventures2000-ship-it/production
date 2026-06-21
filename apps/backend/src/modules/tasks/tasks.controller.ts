import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD, Role.EMPLOYEE)
  updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(id, { status: body.status });
  }

  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.TEAM_LEAD)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
