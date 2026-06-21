import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

// ═══════════════════════════════════════════════════════════════════
// Users Module — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

@Module({
  imports: [
    DatabaseModule,
    AuthModule,                                   // JwtAuthGuard, RbacGuard, JwtStrategy
    BullModule.registerQueue({ name: 'email' }),  // for welcome email on user creation
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
