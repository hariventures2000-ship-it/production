import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bull';
import {
  NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../../../database/schemas/user.schema';
import { Role, AuthType } from '@hariventure/types';

// ═══════════════════════════════════════════════════════════════════
// UsersService — Unit Tests
// ═══════════════════════════════════════════════════════════════════

const mockUser = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e1',
  firstName: 'John',
  lastName: 'Doe',
  username: 'john.doe',
  role: Role.EMPLOYEE,
  authType: AuthType.INTERNAL,
  isActive: true,
  mfaEnabled: false,
  toObject: () => mockUser,
};

const mockCeoUser = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e2',
  role: Role.CEO,
  isActive: true,
};

const mockHrUser = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e3',
  role: Role.HR,
  isActive: true,
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: {
    find: jest.Mock;
    findById: jest.Mock;
    findOne: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    updateOne: jest.Mock;
    create: jest.Mock;
    countDocuments: jest.Mock;
  };
  let emailQueue: { add: jest.Mock };

  beforeEach(async () => {
    userModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      updateOne: jest.fn(),
      create: jest.fn(),
      countDocuments: jest.fn(),
    };
    emailQueue = { add: jest.fn().mockResolvedValue(null) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getQueueToken('email'), useValue: emailQueue },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── findAll ────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns paginated users', async () => {
      const chain = { sort: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([mockUser]) };
      userModel.find.mockReturnValue(chain);
      userModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.users).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.pages).toBe(1);
    });

    it('applies role filter', async () => {
      const chain = { sort: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([]) };
      userModel.find.mockReturnValue(chain);
      userModel.countDocuments.mockResolvedValue(0);

      await service.findAll({ role: Role.HR });
      expect(userModel.find).toHaveBeenCalledWith(expect.objectContaining({ role: Role.HR }));
    });
  });

  // ─── findById ───────────────────────────────────────────────────

  describe('findById', () => {
    it('returns user when found', async () => {
      userModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(mockUser) });
      const result = await service.findById('64a1b2c3d4e5f6a7b8c9d0e1');
      expect(result).toEqual(mockUser);
    });

    it('throws NotFoundException when user missing', async () => {
      userModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      await expect(service.findById('64a1b2c3d4e5f6a7b8c9d0e1')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException for invalid ID', async () => {
      await expect(service.findById('not-an-id')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── createInternalUser ─────────────────────────────────────────

  describe('createInternalUser', () => {
    const dto = {
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'jane.smith',
      role: Role.EMPLOYEE,
      password: 'SecurePass123!',
    };

    it('creates user when CEO is requester', async () => {
      userModel.findById.mockResolvedValue(mockCeoUser);
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue({ ...mockUser, username: 'jane.smith' });

      const result = await service.createInternalUser(dto, mockCeoUser._id);
      expect(result.username).toBe('jane.smith');
      expect(emailQueue.add).toHaveBeenCalledWith(
        'send-welcome-email',
        expect.objectContaining({ name: 'Jane' }),
      );
    });

    it('throws ConflictException when username taken', async () => {
      userModel.findById.mockResolvedValue(mockCeoUser);
      userModel.findOne.mockResolvedValue(mockUser); // username exists

      await expect(
        service.createInternalUser(dto, mockCeoUser._id),
      ).rejects.toThrow(ConflictException);
    });

    it('throws ForbiddenException when HR tries to create CEO', async () => {
      userModel.findById.mockResolvedValue(mockHrUser);
      const ceoDtoAttempt = { ...dto, role: Role.CEO };

      await expect(
        service.createInternalUser(ceoDtoAttempt, mockHrUser._id),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException for non-internal role', async () => {
      userModel.findById.mockResolvedValue(mockCeoUser);
      const clientDtoAttempt = { ...dto, role: Role.CLIENT };

      await expect(
        service.createInternalUser(clientDtoAttempt, mockCeoUser._id),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── deactivate ─────────────────────────────────────────────────

  describe('deactivate', () => {
    it('deactivates user and clears session', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      userModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await service.deactivate(
        mockUser._id,
        mockCeoUser._id,
      );
      expect(result.message).toContain('deactivated');
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { isActive: false },
      );
    });

    it('throws BadRequestException when deactivating self', async () => {
      await expect(
        service.deactivate(mockCeoUser._id, mockCeoUser._id),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── search ─────────────────────────────────────────────────────

  describe('search', () => {
    it('returns matching users', async () => {
      const chain = { limit: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([mockUser]) };
      userModel.find.mockReturnValue(chain);

      const result = await service.search('john');
      expect(result).toHaveLength(1);
    });

    it('throws BadRequestException for short query', async () => {
      await expect(service.search('j')).rejects.toThrow(BadRequestException);
    });
  });
});
