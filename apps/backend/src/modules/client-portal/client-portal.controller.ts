import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ClientPortalService } from './client-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Client Portal')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles(Role.CLIENT)
@Controller('client-portal')
export class ClientPortalController {
  constructor(private readonly clientPortalService: ClientPortalService) {}

  @Get('projects')
  @ApiOperation({ summary: 'List all projects owned by the authenticated client' })
  getProjects(@Req() req: any) {
    return this.clientPortalService.getProjects(req.user.sub);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get details of a specific project owned by the client' })
  getProject(@Req() req: any, @Param('projectId') projectId: string) {
    return this.clientPortalService.getProject(req.user.sub, projectId);
  }

  @Get('projects/:projectId/milestones')
  @ApiOperation({ summary: 'List milestones for a specific project' })
  getMilestones(@Req() req: any, @Param('projectId') projectId: string) {
    return this.clientPortalService.getMilestones(req.user.sub, projectId);
  }

  @Get('projects/:projectId/updates')
  @ApiOperation({ summary: 'List approved updates for a specific project' })
  getUpdates(@Req() req: any, @Param('projectId') projectId: string) {
    return this.clientPortalService.getUpdates(req.user.sub, projectId);
  }

  @Get('projects/:projectId/documents')
  @ApiOperation({ summary: 'List approved documents for a specific project' })
  getDocuments(
    @Req() req: any, 
    @Param('projectId') projectId: string,
    @Query('type') type?: string,
    @Query('search') search?: string
  ) {
    return this.clientPortalService.getDocuments(req.user.sub, projectId, type, search);
  }

  @Post('projects/:projectId/documents/:documentId/download')
  @ApiOperation({ summary: 'Generate a download link for a specific document' })
  downloadDocument(
    @Req() req: any, 
    @Param('projectId') projectId: string,
    @Param('documentId') documentId: string
  ) {
    return this.clientPortalService.downloadDocument(req.user.sub, projectId, documentId);
  }
}
