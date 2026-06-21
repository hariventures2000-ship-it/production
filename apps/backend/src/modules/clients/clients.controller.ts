import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse,
} from '@nestjs/swagger';

import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles, CurrentUser } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import type { JwtPayload } from '@hariventure/types';

import {
  CreateClientDto,
  UpdateClientDto,
  ListClientsQueryDto,
} from './dto/clients.dto';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('v1/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  @ApiOperation({ summary: 'List all clients (paginated)' })
  @ApiResponse({ status: 200, description: 'List of clients' })
  findAll(
    @Query() query: ListClientsQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientsService.findAll(query, user.role, user.sub);
  }

  @Get('search')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  @ApiOperation({ summary: 'Search clients by name or email' })
  @ApiQuery({ name: 'q', required: true, minLength: 2 })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(
    @Query('q') q: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientsService.search(q, user.role, user.sub);
  }

  @Get(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client details' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findById(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientsService.findById(id, user.role, user.sub);
  }

  @Get(':id/statistics')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR, Role.HR, Role.TEAM_LEAD, Role.EMPLOYEE, Role.CLIENT)
  @ApiOperation({ summary: 'Get aggregated client statistics and projects data' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client statistics' })
  getStatistics(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientsService.getStatistics(id, user.role, user.sub);
  }

  @Post()
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  @ApiOperation({ summary: 'Create a new client profile' })
  @ApiResponse({ status: 201, description: 'Client created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  @ApiOperation({ summary: 'Update an existing client profile' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client updated' })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
  @ApiOperation({ summary: 'Delete a client profile completely' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client deleted' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
