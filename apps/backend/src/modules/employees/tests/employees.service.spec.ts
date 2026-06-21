import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { EmployeesService } from '../employees.service';
import { Employee } from '../../../database/schemas/employee.schema';
import { User } from '../../../database/schemas/user.schema';
import { EmployeeSubRole, Department, Role, AuthType } from '@hariventure/types';

// ═══════════════════════════════════════════════════════════════════
// EmployeesService — Unit Tests
// ═══════════════════════════════════════════════════════════════════

const validObjectId = new Types.ObjectId().toHexString();
const validObjectId2 = new Types.ObjectId().toHexString();
const validObjectId3 = new Types.ObjectId().toHexString();

const mockEmployee = {
  _id: validObjectId,
  userId: new Types.ObjectId(validObjectId2),
  employeeId: 'HVD-001',
  subRole: EmployeeSubRole.DEVELOPER,
  department: Department.WEBSITE_DEVELOPMENT,
  salary: { amount: 50000, currency: 'INR', effectiveDate: new Date() },
  joiningDate: new Date(),
  skills: ['React', 'Node.js'],
  experienceYears: 3,
  performanceScore: 80,
  performanceHistory: [],
  status: 'ACTIVE',
  teamId: null,
  managerId: null,
  reportingTo: null,
};

const mockInternalUser = {
  _id: validObjectId2,
  firstName: 'Jane',
  lastName: 'Smith',
  authType: AuthType.INTERNAL,
  role: Role.EMPLOYEE,
  isActive: true,
};

const mockCeoUser = {
  _id: validObjectId3,
  role: Role.CEO,
  authType: AuthType.INTERNAL,
};

const mockHrUser = {
  _id: new Types.ObjectId().toHexString(),
  role: Role.HR,
  authType: AuthType.INTERNAL,
};

const makeChain = (result: unknown) => ({
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result),
});

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeeModel: {
    find: jest.Mock; findById: jest.Mock; findOne: jest.Mock;
    findByIdAndUpdate: jest.Mock; updateOne: jest.Mock;
    create: jest.Mock; countDocuments: jest.Mock; aggregate: jest.Mock;
  };
  let userModel: {
    findById: jest.Mock; updateOne: jest.Mock;
  };

  beforeEach(async () => {
    employeeModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      updateOne: jest.fn(),
      create: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
    };
    userModel = {
      findById: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getModelToken(Employee.name), useValue: employeeModel },
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── findAll ────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns paginated employees', async () => {
      employeeModel.find.mockReturnValue(makeChain([mockEmployee]));
      employeeModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result.employees).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('applies department filter', async () => {
      employeeModel.find.mockReturnValue(makeChain([]));
      employeeModel.countDocuments.mockResolvedValue(0);

      await service.findAll({ department: Department.WEBSITE_DEVELOPMENT });
      expect(employeeModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ department: Department.WEBSITE_DEVELOPMENT }),
      );
    });
  });

  // ─── findById ───────────────────────────────────────────────────

  describe('findById', () => {
    it('returns employee when found', async () => {
      employeeModel.findById.mockReturnValue(makeChain(mockEmployee));
      const result = await service.findById(validObjectId);
      expect(result).toEqual(mockEmployee);
    });

    it('throws NotFoundException when not found', async () => {
      employeeModel.findById.mockReturnValue(makeChain(null));
      await expect(service.findById(validObjectId)).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for invalid ID', async () => {
      await expect(service.findById('bad-id')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── create ─────────────────────────────────────────────────────

  describe('create', () => {
    const dto = {
      userId: validObjectId2,
      employeeId: 'HVD-001',
      subRole: EmployeeSubRole.DEVELOPER,
      department: Department.WEBSITE_DEVELOPMENT,
      salary: { amount: 50000, effectiveDate: '2024-01-01' },
      joiningDate: '2024-01-15',
    };

    it('creates employee profile for valid internal user', async () => {
      userModel.findById.mockResolvedValue(mockInternalUser);
      employeeModel.findOne.mockResolvedValueOnce(null) // no existing profile
                            .mockResolvedValueOnce(null); // no ID conflict
      employeeModel.create.mockResolvedValue(mockEmployee);

      const result = await service.create(dto);
      expect(result.employeeId).toBe('HVD-001');
    });

    it('throws ConflictException when profile already exists', async () => {
      userModel.findById.mockResolvedValue(mockInternalUser);
      employeeModel.findOne.mockResolvedValue(mockEmployee); // existing profile

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for client user', async () => {
      userModel.findById.mockResolvedValue({ ...mockInternalUser, authType: AuthType.CLIENT });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── updateSalary ────────────────────────────────────────────────

  describe('updateSalary', () => {
    const dto = { amount: 70000, effectiveDate: '2025-01-01' };

    it('updates salary when requester is CEO', async () => {
      userModel.findById.mockResolvedValue(mockCeoUser);
      const chain = makeChain(mockEmployee);
      employeeModel.findByIdAndUpdate.mockReturnValue(chain);

      await service.updateSalary(validObjectId, dto, mockCeoUser._id);
      expect(employeeModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('throws ForbiddenException when requester is not CEO/MD', async () => {
      userModel.findById.mockResolvedValue(mockHrUser);
      await expect(
        service.updateSalary(validObjectId, dto, mockHrUser._id),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── terminate ───────────────────────────────────────────────────

  describe('terminate', () => {
    const dto = { terminationDate: '2025-06-30', terminationReason: 'Resignation' };

    it('terminates employee and deactivates user', async () => {
      userModel.findById.mockResolvedValue(mockHrUser);
      employeeModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          ...mockEmployee,
          status: 'ACTIVE',
          userId: { firstName: 'Jane', lastName: 'Smith' },
        }),
      });
      employeeModel.findByIdAndUpdate.mockResolvedValue({});
      userModel.updateOne.mockResolvedValue({});

      const result = await service.terminate(validObjectId, dto, mockHrUser._id);
      expect(result.message).toContain('terminated');
      expect(userModel.updateOne).toHaveBeenCalledWith(
        expect.anything(),
        { isActive: false },
      );
    });

    it('throws BadRequestException when already terminated', async () => {
      userModel.findById.mockResolvedValue(mockHrUser);
      employeeModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({ ...mockEmployee, status: 'TERMINATED', userId: { firstName: 'Jane', lastName: 'Smith' } }),
      });

      await expect(service.terminate(validObjectId, dto, mockHrUser._id)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── getWorkloadSummary ──────────────────────────────────────────

  describe('getWorkloadSummary', () => {
    it('returns aggregated department workload', async () => {
      const mockResult = [{ _id: Department.WEBSITE_DEVELOPMENT, count: 5, avgPerformance: 78 }];
      employeeModel.aggregate.mockResolvedValue(mockResult);

      const result = await service.getWorkloadSummary();
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe(Department.WEBSITE_DEVELOPMENT);
    });
  });
});
