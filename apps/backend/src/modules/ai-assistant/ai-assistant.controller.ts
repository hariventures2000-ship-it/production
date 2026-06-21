import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@hariventure/types';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('AI Assistant')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('v1/ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiService: AiAssistantService) {}

  @Roles(Role.CLIENT)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('query')
  @ApiOperation({ summary: 'Ask Kamban AI a question' })
  async queryAssistant(@Req() req: any, @Body() body: { query: string; projectId?: string }) {
    return this.aiService.processQuery(req.user.sub, body.query, body.projectId);
  }
}
