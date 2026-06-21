import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MdDashboardController } from './md-dashboard.controller';
import { MdDashboardService } from './md-dashboard.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MdDashboardController],
  providers: [MdDashboardService],
})
export class MdDashboardModule {}
