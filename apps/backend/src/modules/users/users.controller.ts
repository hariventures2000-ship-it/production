import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles, CurrentUser } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import type { JwtPayload } from '@hariventure/types';
import {
  CreateInternalUserDto,
  UpdateUserProfileDto,
  AdminUpdateUserDto,
  ListUsersQueryDto,
} from './dto/users.dto';

// ═══════════════════════════════════════════════════════════════════
// Users Controller — Hariventure Digital Production
// Prefix: /v1/users
// ═══════════════════════════════════════════════════════════════════

@ApiTags('users')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── LIST ALL USERS (CEO, MD, HR only) ──────────────────────────
  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'List all users (paginated, filterable)' })
  async findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  // ─── SEARCH USERS ────────────────────────────────────────────────
  @Get('search')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'Search users by name, email, or username' })
  @ApiQuery({ name: 'q', description: 'Search term (min 2 chars)' })
  async search(@Query('q') q: string) {
    return this.usersService.search(q);
  }

  // ─── GET CURRENT USER PROFILE ────────────────────────────────────
  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }

  // ─── UPDATE OWN PROFILE ──────────────────────────────────────────
  @Patch('me')
  @ApiOperation({ summary: 'Update own profile (name, phone, avatar)' })
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  // ─── GET USER BY ID ──────────────────────────────────────────────
  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // ─── CREATE INTERNAL USER (CEO, HR only) ─────────────────────────
  @Post('internal')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Create a new internal user account (CEO/HR only)' })
  @HttpCode(HttpStatus.CREATED)
  async createInternalUser(
    @Body() dto: CreateInternalUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.createInternalUser(dto, user.sub);
  }

  // ─── ADMIN UPDATE USER ───────────────────────────────────────────
  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Admin update user (role, active status, profile)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of target user' })
  @HttpCode(HttpStatus.OK)
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.adminUpdate(id, dto, user.sub);
  }

  // ─── DEACTIVATE USER ─────────────────────────────────────────────
  @Delete(':id/deactivate')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Deactivate user (soft delete — revokes session)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of target user' })
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.deactivate(id, user.sub);
  }

  // ─── REACTIVATE USER ─────────────────────────────────────────────
  @Patch(':id/reactivate')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR)
  @ApiOperation({ summary: 'Reactivate a deactivated user' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of target user' })
  @HttpCode(HttpStatus.OK)
  async reactivate(@Param('id') id: string) {
    return this.usersService.reactivate(id);
  }
}
