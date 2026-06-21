import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

// ═══════════════════════════════════════════════════════════════════
// Employees Module — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

@Module({
  imports: [
    DatabaseModule,  // Employee, User, Team schemas
    AuthModule,      // JwtAuthGuard, RbacGuard, JwtStrategy
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],  // Exported for AI task assignment, analytics
})
export class EmployeesModule {}
