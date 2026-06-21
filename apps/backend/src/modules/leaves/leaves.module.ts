import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [DatabaseModule, LeavesService],
})
export class LeavesModule {}
