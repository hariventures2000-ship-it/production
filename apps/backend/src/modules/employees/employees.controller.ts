import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth,
  ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles, CurrentUser } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import type { JwtPayload } from '@hariventure/types';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateSalaryDto,
  AddPerformanceDto,
  TerminateEmployeeDto,
  ListEmployeesQueryDto,
} from './dto/employees.dto';

// ═══════════════════════════════════════════════════════════════════
// Employees Controller — Hariventure Digital Production
// Prefix: /v1/employees
// ═══════════════════════════════════════════════════════════════════

@ApiTags('employees')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // ─── LIST EMPLOYEES ──────────────────────────────────────────────
  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'List all employees (paginated, filterable by dept/role/team)' })
  async findAll(@Query() query: ListEmployeesQueryDto) {
    return this.employeesService.findAll(query);
  }

  // ─── WORKLOAD SUMMARY ────────────────────────────────────────────
  @Get('workload')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'Get workload summary grouped by department' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Filter by team ObjectId' })
  async getWorkload(@Query('teamId') teamId?: string) {
    return this.employeesService.getWorkloadSummary(teamId);
  }

  // ─── OWN EMPLOYEE PROFILE ────────────────────────────────────────
  @Get('me')
  @ApiOperation({ summary: 'Get own employee profile (employees only)' })
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    return this.employeesService.findByUserId(user.sub);
  }

  // ─── GET BY EMPLOYEE RECORD ID ───────────────────────────────────
  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'Get employee profile by record ID' })
  @ApiParam({ name: 'id', description: 'Employee record ObjectId' })
  async findById(@Param('id') id: string) {
    return this.employeesService.findById(id);
  }

  // ─── GET BY USER ID ──────────────────────────────────────────────
  @Get('by-user/:userId')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'Get employee profile by user ID' })
  @ApiParam({ name: 'userId', description: 'User ObjectId' })
  async findByUserId(@Param('userId') userId: string) {
    return this.employeesService.findByUserId(userId);
  }

  // ─── CREATE EMPLOYEE PROFILE (HR / CEO / MD) ─────────────────────
  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Create employee profile for an existing internal user' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  // ─── UPDATE EMPLOYEE ─────────────────────────────────────────────
  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Update employee profile (dept, sub-role, team, skills)' })
  @ApiParam({ name: 'id', description: 'Employee record ObjectId' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  // ─── UPDATE SALARY (CEO / MD only) ───────────────────────────────
  @Patch(':id/salary')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  @ApiOperation({ summary: 'Update employee salary (CEO/MD only)' })
  @ApiParam({ name: 'id', description: 'Employee record ObjectId' })
  @HttpCode(HttpStatus.OK)
  async updateSalary(
    @Param('id') id: string,
    @Body() dto: UpdateSalaryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.updateSalary(id, dto, user.sub);
  }

  // ─── ADD PERFORMANCE ENTRY (Team Lead / HR / CEO / MD) ───────────
  @Post(':id/performance')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'Add performance review entry for an employee' })
  @ApiParam({ name: 'id', description: 'Employee record ObjectId' })
  @HttpCode(HttpStatus.CREATED)
  async addPerformance(
    @Param('id') id: string,
    @Body() dto: AddPerformanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.addPerformanceEntry(id, dto, user.sub);
  }

  // ─── TERMINATE EMPLOYEE (HR / CEO / MD only) ─────────────────────
  @Delete(':id/terminate')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Terminate employee and deactivate their user account' })
  @ApiParam({ name: 'id', description: 'Employee record ObjectId' })
  @HttpCode(HttpStatus.OK)
  async terminate(
    @Param('id') id: string,
    @Body() dto: TerminateEmployeeDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.terminate(id, dto, user.sub);
  }
}
