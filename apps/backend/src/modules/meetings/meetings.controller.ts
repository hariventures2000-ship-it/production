import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller()
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // --------------------------------------------------------------------------
  // CLIENT ENDPOINTS
  // --------------------------------------------------------------------------

  @ApiTags('Client Meetings')
  @Roles(Role.CLIENT)
  @Post('v1/meetings')
  @ApiOperation({ summary: 'Request a new meeting' })
  createMeeting(@Req() req: any, @Body() body: any) {
    return this.meetingsService.createMeeting(req.user.sub, body);
  }

  @ApiTags('Client Meetings')
  @Roles(Role.CLIENT)
  @Get('v1/meetings')
  @ApiOperation({ summary: 'List owned meetings' })
  getClientMeetings(@Req() req: any) {
    return this.meetingsService.getClientMeetings(req.user.sub);
  }

  @ApiTags('Client Meetings')
  @Roles(Role.CLIENT)
  @Delete('v1/meetings/:id')
  @ApiOperation({ summary: 'Cancel pending meeting request' })
  cancelMeeting(@Req() req: any, @Param('id') id: string) {
    return this.meetingsService.cancelMeeting(req.user.sub, id);
  }

  // --------------------------------------------------------------------------
  // INTERNAL ENDPOINTS
  // --------------------------------------------------------------------------

  @ApiTags('Internal Meetings')
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get('v1/internal/meetings')
  @ApiOperation({ summary: 'List all meeting requests' })
  getAllInternalMeetings() {
    return this.meetingsService.getAllInternalMeetings();
  }

  @ApiTags('Internal Meetings')
  @Roles(Role.HR)
  @Patch('v1/internal/meetings/:id/approve')
  @ApiOperation({ summary: 'Approve a meeting request' })
  approveMeeting(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.meetingsService.approveMeeting(req.user.sub, id, data);
  }

  @ApiTags('Internal Meetings')
  @Roles(Role.HR)
  @Patch('v1/internal/meetings/:id/reject')
  @ApiOperation({ summary: 'Reject a meeting request' })
  rejectMeeting(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.meetingsService.rejectMeeting(req.user.sub, id, data);
  }

  @ApiTags('Internal Meetings')
  @Roles(Role.HR)
  @Patch('v1/internal/meetings/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule a meeting request' })
  rescheduleMeeting(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.meetingsService.rescheduleMeeting(req.user.sub, id, data);
  }
}
