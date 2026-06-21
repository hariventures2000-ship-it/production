import {
  Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { Project, ProjectDocument } from '../../database/schemas/project.schema';
import { Role } from '@hariventure/types';
import { CreateClientDto, UpdateClientDto, ListClientsQueryDto } from './dto/clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
  ) {}

  // Helper to enforce ownership for CLIENT role
  private checkOwnership(client: ClientDocument, userRole: Role, userId: string) {
    if (userRole === Role.CLIENT && client.userId.toString() !== userId) {
      throw new ForbiddenException('You can only access your own client data');
    }
  }

  async findAll(query: ListClientsQueryDto, userRole: Role, userId: string) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status !== undefined) filter.status = status;
    
    // Ownership enforcement for list
    if (userRole === Role.CLIENT) {
      filter.userId = new Types.ObjectId(userId);
    }

    const [clients, total] = await Promise.all([
      this.clientModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.clientModel.countDocuments(filter),
    ]);

    return {
      clients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, userRole: Role, userId: string): Promise<ClientDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }
    const client = await this.clientModel.findById(id).lean();
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    
    this.checkOwnership(client as unknown as ClientDocument, userRole, userId);
    return client as unknown as ClientDocument;
  }

  async create(dto: CreateClientDto): Promise<ClientDocument> {
    const existing = await this.clientModel.findOne({
      contactEmail: dto.contactEmail.toLowerCase(),
    });
    if (existing) {
      throw new ConflictException(`Client with email '${dto.contactEmail}' already exists`);
    }

    const client = await this.clientModel.create({
      ...dto,
      contactEmail: dto.contactEmail.toLowerCase(),
    });

    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<ClientDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }

    if (dto.contactEmail) {
      const existing = await this.clientModel.findOne({
        contactEmail: dto.contactEmail.toLowerCase(),
        _id: { $ne: id },
      });
      if (existing) {
        throw new ConflictException(`Email '${dto.contactEmail}' is already in use by another client`);
      }
      dto.contactEmail = dto.contactEmail.toLowerCase();
    }

    const client = await this.clientModel
      .findByIdAndUpdate(
        id,
        { $set: dto },
        { new: true, runValidators: true },
      )
      .lean();

    if (!client) throw new NotFoundException('Client not found');
    return client as unknown as ClientDocument;
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }

    const client = await this.clientModel.findByIdAndDelete(id);
    if (!client) throw new NotFoundException('Client not found');

    // Also remove client references from projects or set to inactive based on business rules
    // For now, we just delete the client profile.

    return { message: `Client ${client.companyName} deleted successfully` };
  }

  async search(q: string, userRole: Role, userId: string): Promise<ClientDocument[]> {
    if (!q || q.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    const regex = new RegExp(q.trim(), 'i');
    const filter: Record<string, unknown> = {
      $or: [
        { companyName: regex },
        { contactEmail: regex },
      ],
    };

    if (userRole === Role.CLIENT) {
      filter.userId = new Types.ObjectId(userId);
    }

    return this.clientModel
      .find(filter)
      .limit(20)
      .lean() as unknown as Promise<ClientDocument[]>;
  }

  async getStatistics(id: string, userRole: Role, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid client ID format');
    }

    const client = await this.clientModel.findById(id).lean();
    if (!client) throw new NotFoundException('Client not found');

    this.checkOwnership(client as unknown as ClientDocument, userRole, userId);

    // Aggregate statistics from projects
    const projects = await this.projectModel.find({ clientId: id }).lean();
    
    const activeProjects = projects.filter((p: any) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED');
    const completedProjects = projects.filter((p: any) => p.status === 'COMPLETED');
    const totalBudget = projects.reduce((acc, p: any) => acc + (p.budget || 0), 0);
    const totalCost = projects.reduce((acc, p: any) => acc + (p.actualCost || 0), 0);

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      totalBudget,
      totalCost,
      totalRevenue: client.totalRevenue || 0,
      status: client.status,
    };
  }
}
