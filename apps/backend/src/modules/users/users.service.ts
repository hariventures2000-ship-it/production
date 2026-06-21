import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Model, Types } from 'mongoose';
import { Queue } from 'bull';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Role, AuthType, ROLE_LABELS, INTERNAL_ROLES } from '@hariventure/types';
import {
  CreateInternalUserDto,
  UpdateUserProfileDto,
  AdminUpdateUserDto,
  ListUsersQueryDto,
} from './dto/users.dto';

const SALT_ROUNDS = 12;

// ═══════════════════════════════════════════════════════════════════
// Users Service — Hariventure Digital Production
// ═══════════════════════════════════════════════════════════════════

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  // ─── LIST USERS (paginated) ─────────────────────────────────────

  async findAll(query: ListUsersQueryDto) {
    const { role, authType, isActive, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (role !== undefined) filter.role = role;
    if (authType !== undefined) filter.authType = authType;
    if (isActive !== undefined) filter.isActive = isActive;

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ─── GET ONE USER ────────────────────────────────────────────────

  async findById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user as unknown as UserDocument;
  }

  // ─── CREATE INTERNAL USER (CEO / HR only) ───────────────────────

  async createInternalUser(
    dto: CreateInternalUserDto,
    requesterId: string,
  ): Promise<UserDocument> {
    // Only internal roles can be created via this endpoint
    if (!INTERNAL_ROLES.includes(dto.role)) {
      throw new BadRequestException(
        `Role ${dto.role} cannot be created via this endpoint. Client accounts are self-registered.`,
      );
    }

    // Prevent escalation: HR cannot create CEO/MD
    const requester = await this.userModel.findById(requesterId);
    if (!requester) throw new NotFoundException('Requesting user not found');
    if (
      requester.role === Role.HR &&
      [Role.CEO, Role.MANAGING_DIRECTOR].includes(dto.role)
    ) {
      throw new ForbiddenException('HR cannot create CEO or Managing Director accounts');
    }

    const existing = await this.userModel.findOne({
      username: dto.username.toLowerCase(),
    });
    if (existing) {
      throw new ConflictException(`Username '${dto.username}' is already taken`);
    }

    const internalPasswordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.userModel.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username.toLowerCase(),
      phone: dto.phone ?? null,
      role: dto.role,
      authType: AuthType.INTERNAL,
      isEmailVerified: true, // internal users don't verify email
      internalPasswordHash,
      mfaEnabled: false, // forced on first login
    });

    // Send welcome email (non-blocking)
    this.emailQueue
      .add('send-welcome-email', {
        to: `${dto.username}@hariventure.com`,
        name: dto.firstName,
        role: ROLE_LABELS[dto.role],
      })
      .catch(() => {
        // Non-critical — user creation succeeded regardless
      });

    return user;
  }

  // ─── UPDATE OWN PROFILE ─────────────────────────────────────────

  async updateProfile(
    userId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: dto },
        { new: true, runValidators: true },
      )
      .lean();

    if (!user) throw new NotFoundException('User not found');
    return user as unknown as UserDocument;
  }

  // ─── ADMIN UPDATE USER ───────────────────────────────────────────

  async adminUpdate(
    targetId: string,
    dto: AdminUpdateUserDto,
    requesterId: string,
  ): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(targetId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Prevent self-deactivation
    if (targetId === requesterId && dto.isActive === false) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    const target = await this.userModel.findById(targetId);
    if (!target) throw new NotFoundException('Target user not found');

    // Prevent downgrading a CEO (only another CEO can)
    const requester = await this.userModel.findById(requesterId);
    if (!requester) throw new NotFoundException('Requesting user not found');
    if (
      target.role === Role.CEO &&
      requester.role !== Role.CEO
    ) {
      throw new ForbiddenException('Only a CEO can modify another CEO account');
    }

    const updated = await this.userModel
      .findByIdAndUpdate(
        targetId,
        { $set: dto },
        { new: true, runValidators: true },
      )
      .lean();

    return updated as unknown as UserDocument;
  }

  // ─── DEACTIVATE USER ─────────────────────────────────────────────

  async deactivate(targetId: string, requesterId: string): Promise<{ message: string }> {
    if (targetId === requesterId) {
      throw new BadRequestException('You cannot deactivate your own account');
    }
    const user = await this.userModel.findById(targetId);
    if (!user) throw new NotFoundException('User not found');

    await this.userModel.updateOne(
      { _id: targetId },
      { isActive: false },
    );

    return { message: `User ${user.firstName} ${user.lastName} has been deactivated` };
  }

  // ─── REACTIVATE USER ─────────────────────────────────────────────

  async reactivate(targetId: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndUpdate(
      targetId,
      { isActive: true },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return { message: `User ${user.firstName} ${user.lastName} has been reactivated` };
  }

  // ─── SEARCH USERS ────────────────────────────────────────────────

  async search(q: string): Promise<UserDocument[]> {
    if (!q || q.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    const regex = new RegExp(q.trim(), 'i');
    return this.userModel
      .find({
        isActive: true,
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { username: regex },
        ],
      })
      .limit(20)
      .lean() as unknown as UserDocument[];
  }
}
