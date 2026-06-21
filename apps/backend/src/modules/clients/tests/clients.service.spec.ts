import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ClientsService } from '../clients.service';
import { Client } from '../../../database/schemas/client.schema';
import { Project } from '../../../database/schemas/project.schema';
import { Role } from '@hariventure/types';
import { ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';

describe('ClientsService', () => {
  let service: ClientsService;

  const mockClientModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  const mockProjectModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: getModelToken(Client.name), useValue: mockClientModel },
        { provide: getModelToken(Project.name), useValue: mockProjectModel },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should throw ForbiddenException if CLIENT role tries to access another client', async () => {
      const clientId = new Types.ObjectId().toString();
      const otherUserId = new Types.ObjectId().toString();

      mockClientModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ userId: new Types.ObjectId() }),
      });

      await expect(service.findById(clientId, Role.CLIENT, otherUserId))
        .rejects.toThrow(ForbiddenException);
    });

    it('should allow CEO to access any client', async () => {
      const clientId = new Types.ObjectId().toString();
      const clientUserId = new Types.ObjectId();
      const ceoId = new Types.ObjectId().toString();

      const mockClient = { userId: clientUserId };

      mockClientModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockClient),
      });

      const result = await service.findById(clientId, Role.CEO, ceoId);
      expect(result).toEqual(mockClient);
    });
  });

  describe('create', () => {
    it('should create a new client if email is unique', async () => {
      const dto = {
        userId: new Types.ObjectId().toString(),
        companyName: 'Acme Corp',
        contactEmail: 'test@acme.com',
      };

      mockClientModel.findOne.mockResolvedValue(null);
      mockClientModel.create.mockResolvedValue(dto);

      const result = await service.create(dto);
      expect(result).toEqual(dto);
      expect(mockClientModel.create).toHaveBeenCalledWith({
        ...dto,
        contactEmail: 'test@acme.com',
      });
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = {
        userId: new Types.ObjectId().toString(),
        companyName: 'Acme Corp',
        contactEmail: 'test@acme.com',
      };

      mockClientModel.findOne.mockResolvedValue({ _id: 'someId' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });
});
