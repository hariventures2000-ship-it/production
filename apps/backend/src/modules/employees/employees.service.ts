import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../../database/schemas/employee.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { AuthType, Role } from '@hariventure/types';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateSalaryDto,
  AddPerformanceDto,
  TerminateEmployeeDto,
  ListEmployeesQueryDto,
} from './dto/employees.dto';

// ═══════════════════════════════════════════════════════════════════
// Employees Service — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // ─── LIST EMPLOYEES (paginated) ─────────────────────────────────

  async findAll(query: ListEmployeesQueryDto) {
    const { department, subRole, status, teamId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (department) filter.department = department;
    if (subRole) filter.subRole = subRole;
    if (status) filter.status = status;
    if (teamId) filter.teamId = new Types.ObjectId(teamId);

    const [employees, total] = await Promise.all([
      this.employeeModel
        .find(filter)
        .populate('userId', 'firstName lastName email username avatar phone')
        .populate('teamId', 'name')
        .populate('managerId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.employeeModel.countDocuments(filter),
    ]);

    return {
      employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ─── GET EMPLOYEE BY EMPLOYEE RECORD ID ─────────────────────────

  async findById(id: string): Promise<EmployeeDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid employee record ID');
    }
    const employee = await this.employeeModel
      .findById(id)
      .populate('userId', 'firstName lastName email username avatar phone role')
      .populate('teamId', 'name')
      .populate('managerId', 'firstName lastName')
      .populate('reportingTo', 'firstName lastName role')
      .lean();

    if (!employee) throw new NotFoundException(`Employee record ${id} not found`);
    return employee as unknown as EmployeeDocument;
  }

  // ─── GET EMPLOYEE BY USER ID ─────────────────────────────────────

  async findByUserId(userId: string): Promise<EmployeeDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const employee = await this.employeeModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'firstName lastName email username avatar phone')
      .populate('teamId', 'name')
      .populate('managerId', 'firstName lastName')
      .lean();

    if (!employee) throw new NotFoundException('Employee profile not found for this user');
    return employee as unknown as EmployeeDocument;
  }

  // ─── CREATE EMPLOYEE PROFILE ─────────────────────────────────────

  async create(dto: CreateEmployeeDto): Promise<EmployeeDocument> {
    // Validate user exists and is internal
    const user = await this.userModel.findById(dto.userId);
    if (!user) {
      throw new NotFoundException(`User ${dto.userId} not found`);
    }
    if (user.authType !== AuthType.INTERNAL) {
      throw new BadRequestException('Only internal users can have an employee profile');
    }

    // Prevent duplicate profiles
    const existing = await this.employeeModel.findOne({
      userId: new Types.ObjectId(dto.userId),
    });
    if (existing) {
      throw new ConflictException('An employee profile already exists for this user');
    }

    // Check employee ID uniqueness
    const idConflict = await this.employeeModel.findOne({
      employeeId: dto.employeeId.toUpperCase(),
    });
    if (idConflict) {
      throw new ConflictException(`Employee ID '${dto.employeeId}' is already in use`);
    }

    return this.employeeModel.create({
      userId: new Types.ObjectId(dto.userId),
      employeeId: dto.employeeId.toUpperCase(),
      subRole: dto.subRole,
      department: dto.department,
      salary: {
        amount: dto.salary.amount,
        currency: dto.salary.currency ?? 'INR',
        effectiveDate: new Date(dto.salary.effectiveDate),
      },
      joiningDate: new Date(dto.joiningDate),
      skills: dto.skills ?? [],
      experienceYears: dto.experienceYears ?? 0,
      teamId: dto.teamId ? new Types.ObjectId(dto.teamId) : null,
      managerId: dto.managerId ? new Types.ObjectId(dto.managerId) : null,
      reportingTo: dto.reportingTo ? new Types.ObjectId(dto.reportingTo) : null,
      status: 'ACTIVE',
    });
  }

  // ─── UPDATE EMPLOYEE ─────────────────────────────────────────────

  async update(id: string, dto: UpdateEmployeeDto): Promise<EmployeeDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid employee record ID');
    }

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.teamId) updateData.teamId = new Types.ObjectId(dto.teamId);
    if (dto.managerId) updateData.managerId = new Types.ObjectId(dto.managerId);
    if (dto.reportingTo) updateData.reportingTo = new Types.ObjectId(dto.reportingTo);

    const updated = await this.employeeModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
      .populate('userId', 'firstName lastName email username')
      .lean();

    if (!updated) throw new NotFoundException(`Employee record ${id} not found`);
    return updated as unknown as EmployeeDocument;
  }

  // ─── UPDATE SALARY ────────────────────────────────────────────────

  async updateSalary(
    id: string,
    dto: UpdateSalaryDto,
    requesterId: string,
  ): Promise<EmployeeDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid employee record ID');
    }

    // Only CEO and MD can update salaries
    const requester = await this.userModel.findById(requesterId);
    if (!requester || ![Role.CEO, Role.MANAGING_DIRECTOR].includes(requester.role)) {
      throw new ForbiddenException('Only CEO or Managing Director can update salaries');
    }

    const updated = await this.employeeModel.findByIdAndUpdate(
      id,
      {
        $set: {
          salary: {
            amount: dto.amount,
            currency: dto.currency ?? 'INR',
            effectiveDate: new Date(dto.effectiveDate),
          },
        },
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) throw new NotFoundException(`Employee record ${id} not found`);
    return updated as unknown as EmployeeDocument;
  }

  // ─── ADD PERFORMANCE REVIEW ───────────────────────────────────────

  async addPerformanceEntry(
    id: string,
    dto: AddPerformanceDto,
    reviewerId: string,
  ): Promise<EmployeeDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid employee record ID');
    }

    const entry = {
      score: dto.score,
      period: dto.period,
      notes: dto.notes ?? null,
      reviewedById: new Types.ObjectId(reviewerId),
      date: new Date(),
    };

    const updated = await this.employeeModel.findByIdAndUpdate(
      id,
      {
        $push: { performanceHistory: entry },
        $set: { performanceScore: dto.score },
      },
      { new: true },
    ).lean();

    if (!updated) throw new NotFoundException(`Employee record ${id} not found`);
    return updated as unknown as EmployeeDocument;
  }

  // ─── TERMINATE EMPLOYEE ───────────────────────────────────────────

  async terminate(
    id: string,
    dto: TerminateEmployeeDto,
    requesterId: string,
  ): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid employee record ID');
    }

    const requester = await this.userModel.findById(requesterId);
    if (!requester || ![Role.CEO, Role.MANAGING_DIRECTOR, Role.HR].includes(requester.role)) {
      throw new ForbiddenException('Only CEO, MD, or HR can terminate employees');
    }

    const employee = await this.employeeModel
      .findById(id)
      .populate('userId', 'firstName lastName');
    if (!employee) throw new NotFoundException(`Employee record ${id} not found`);
    if (employee.status === 'TERMINATED') {
      throw new BadRequestException('Employee is already terminated');
    }

    await this.employeeModel.findByIdAndUpdate(id, {
      $set: {
        status: 'TERMINATED',
        terminationDate: new Date(dto.terminationDate),
        terminationReason: dto.terminationReason,
      },
    });

    // Also deactivate the user account
    await this.userModel.updateOne(
      { _id: employee.userId },
      { isActive: false },
    );

    const user = employee.userId as unknown as { firstName: string; lastName: string };
    return {
      message: `Employee ${user.firstName} ${user.lastName} has been terminated and their account deactivated`,
    };
  }

  // ─── WORKLOAD SUMMARY (Team Lead / MD / CEO) ─────────────────────

  async getWorkloadSummary(teamId?: string) {
    const matchStage: Record<string, unknown> = { status: 'ACTIVE' };
    if (teamId) matchStage.teamId = new Types.ObjectId(teamId);

    return this.employeeModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgPerformance: { $avg: '$performanceScore' },
          avgExperience: { $avg: '$experienceYears' },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}
