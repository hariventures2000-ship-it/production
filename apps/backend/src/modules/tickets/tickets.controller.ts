import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // --------------------------------------------------------------------------
  // CLIENT ENDPOINTS
  // --------------------------------------------------------------------------

  @ApiTags('Client Tickets')
  @Roles(Role.CLIENT)
  @Post('v1/tickets')
  @ApiOperation({ summary: 'Create a new support ticket' })
  createTicket(@Req() req: any, @Body() body: any) {
    return this.ticketsService.createTicket(req.user.sub, body);
  }

  @ApiTags('Client Tickets')
  @Roles(Role.CLIENT)
  @Get('v1/tickets')
  @ApiOperation({ summary: 'List owned tickets' })
  getClientTickets(@Req() req: any) {
    return this.ticketsService.getClientTickets(req.user.sub);
  }

  @ApiTags('Client Tickets')
  @Roles(Role.CLIENT)
  @Get('v1/tickets/:id')
  @ApiOperation({ summary: 'View specific ticket' })
  getTicket(@Req() req: any, @Param('id') id: string) {
    return this.ticketsService.getTicket(req.user.sub, id, 'CLIENT');
  }

  @ApiTags('Client Tickets')
  @Roles(Role.CLIENT)
  @Patch('v1/tickets/:id/reply')
  @ApiOperation({ summary: 'Reply to a ticket' })
  replyTicket(@Req() req: any, @Param('id') id: string, @Body('message') message: string) {
    return this.ticketsService.replyToTicket(req.user.sub, 'CLIENT', id, message);
  }

  @ApiTags('Client Tickets')
  @Roles(Role.CLIENT)
  @Patch('v1/tickets/:id/close')
  @ApiOperation({ summary: 'Close a ticket' })
  closeTicket(@Req() req: any, @Param('id') id: string) {
    return this.ticketsService.updateTicketStatus(req.user.sub, 'CLIENT', id, 'CLOSED');
  }

  // --------------------------------------------------------------------------
  // INTERNAL ENDPOINTS
  // --------------------------------------------------------------------------

  @ApiTags('Internal Tickets')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get('v1/internal/tickets')
  @ApiOperation({ summary: 'List all tickets' })
  getInternalTickets() {
    return this.ticketsService.getAllInternalTickets();
  }

  @ApiTags('Internal Tickets')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get('v1/internal/tickets/:id')
  @ApiOperation({ summary: 'View specific ticket internally' })
  getInternalTicket(@Req() req: any, @Param('id') id: string) {
    return this.ticketsService.getTicket(req.user.sub, id, req.user.role);
  }

  @ApiTags('Internal Tickets')
  @Roles(Role.HR)
  @Patch('v1/internal/tickets/:id/assign')
  @ApiOperation({ summary: 'Assign a ticket' })
  assignTicket(@Req() req: any, @Param('id') id: string, @Body('assigneeId') assigneeId: string) {
    return this.ticketsService.assignTicket(req.user.sub, id, assigneeId);
  }

  @ApiTags('Internal Tickets')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR)
  @Patch('v1/internal/tickets/:id/reply')
  @ApiOperation({ summary: 'Reply to a ticket internally' })
  replyInternalTicket(@Req() req: any, @Param('id') id: string, @Body('message') message: string) {
    return this.ticketsService.replyToTicket(req.user.sub, req.user.role, id, message);
  }

  @ApiTags('Internal Tickets')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR)
  @Patch('v1/internal/tickets/:id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateTicketStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.ticketsService.updateTicketStatus(req.user.sub, req.user.role, id, status);
  }
}
