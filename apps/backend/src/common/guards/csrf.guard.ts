import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_CSRF_KEY } from '../../modules/auth/decorators/skip-csrf.decorator';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSkipped = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isSkipped) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    
    // Allow safe methods by default
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    // CSRF Enforcement for POST/PUT/PATCH/DELETE
    const csrfCookie = request.cookies?.['csrfToken'];
    const csrfHeader = request.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      console.log(`[CSRF ERROR] Cookie: ${csrfCookie} | Header: ${csrfHeader}`);
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
