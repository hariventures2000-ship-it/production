import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@hariventure/types';
import type { JwtPayload } from '@hariventure/types';

// ─── METADATA KEYS ──────────────────────────────────────────────────
export const ROLES_KEY = 'roles';

// ─── @Roles(...) decorator ───────────────────────────────────────────
// Usage: @Roles(Role.CEO, Role.MANAGING_DIRECTOR)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// ─── @Public() decorator ─────────────────────────────────────────────
// Bypasses JwtAuthGuard on a route
export const Public = () => SetMetadata('isPublic', true);

// ─── @CurrentUser() param decorator ─────────────────────────────────
// Extracts the authenticated JwtPayload from request.user
// Usage: @CurrentUser() user: JwtPayload
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
