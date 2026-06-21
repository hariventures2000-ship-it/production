import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ProjectRequestsService } from './project-requests.service';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { ReviewProjectRequestDto } from './dto/review-project-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { Public } from '../auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('project-requests')
export class ProjectRequestsController {
  constructor(private readonly projectRequestsService: ProjectRequestsService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  create(@Body() createProjectRequestDto: CreateProjectRequestDto) {
    return this.projectRequestsService.create(createProjectRequestDto);
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get()
  findAll() {
    return this.projectRequestsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectRequestsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(Role.HR, Role.MANAGING_DIRECTOR, Role.CEO)
  @Patch(':id/review')
  review(@Param('id') id: string, @Body() reviewDto: ReviewProjectRequestDto, @Req() req: any) {
    return this.projectRequestsService.review(id, reviewDto, req.user);
  }
}
