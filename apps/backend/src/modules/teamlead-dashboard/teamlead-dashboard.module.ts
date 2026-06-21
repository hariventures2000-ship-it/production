import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TeamleadDashboardController } from './teamlead-dashboard.controller';
import { TeamleadDashboardService } from './teamlead-dashboard.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TeamleadDashboardController],
  providers: [TeamleadDashboardService],
})
export class TeamleadDashboardModule {}
