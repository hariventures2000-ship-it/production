import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [DatabaseModule, MilestonesService],
})
export class MilestonesModule {}
