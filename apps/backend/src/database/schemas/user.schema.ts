import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role, AuthType } from '@hariventure/types';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: String, required: true, enum: Object.values(Role) })
  role: Role;

  @Prop({ type: String, required: true, enum: Object.values(AuthType) })
  authType: AuthType;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ trim: true, default: null })
  avatar: string;

  @Prop({ trim: true, default: null })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  lastLoginAt: Date;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop({ default: null })
  lockoutUntil?: Date;

  @Prop({ default: null })
  lastFailedLoginAt?: Date;

  @Prop({ default: null })
  lastPasswordChangeAt: Date;

  @Prop({ default: 0 })
  tokenVersion: number;

  @Prop({ default: null })
  passwordResetToken: string;

  @Prop({ default: null })
  passwordResetExpiry: Date;

  // ─── CLIENT-SPECIFIC FIELDS ─────────────────────────────────────
  @Prop({
    sparse: true,
    unique: true,
    trim: true,
    lowercase: true,
    default: null,
  })
  email: string;

  @Prop({ default: null, select: false })
  passwordHash: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: null, select: false })
  emailVerifyToken: string;

  @Prop({ default: null })
  emailVerifyExpiry: Date;

  @Prop({ default: false })
  isFirstLogin: boolean;

  // ─── INTERNAL-SPECIFIC FIELDS ───────────────────────────────────
  @Prop({ sparse: true, unique: true, trim: true, lowercase: true, default: null })
  username: string;

  @Prop({ default: null, select: false })
  internalPasswordHash: string;

  @Prop({ default: false })
  mfaEnabled: boolean;

  @Prop({ default: null, select: false })
  mfaSecret: string; // AES-256 encrypted TOTP secret

  @Prop({ type: [String], default: [], select: false })
  mfaBackupCodes: string[]; // bcrypt-hashed backup codes

  @Prop({ default: null })
  mfaEnabledAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ─── INDEXES ────────────────────────────────────────────────────────
UserSchema.index({ email: 1 }, { sparse: true, unique: true });
UserSchema.index({ username: 1 }, { sparse: true, unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ authType: 1, isActive: 1 });

// ─── VIRTUAL: fullName ──────────────────────────────────────────────
UserSchema.virtual('fullName').get(function (this: User) {
  return `${this.firstName} ${this.lastName}`;
});

// ─── TRANSFORM: Remove sensitive fields from JSON output ────────────
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: any, ret: any) => {
    delete ret.passwordHash;
    delete ret.internalPasswordHash;
    delete ret.mfaSecret;
    delete ret.mfaBackupCodes;
    delete ret.emailVerifyToken;
    delete ret.__v;
    return ret;
  },
});
