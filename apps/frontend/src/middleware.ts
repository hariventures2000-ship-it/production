import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ═══════════════════════════════════════════════════════════════════
// HARIVENTURE DIGITAL PRODUCTION — RBAC Routing Middleware
// ═══════════════════════════════════════════════════════════════════

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  CLIENT:             '/dashboard/client',
  CEO:                '/dashboard/ceo',
  MANAGING_DIRECTOR:  '/dashboard/md',
  HR:                 '/dashboard/hr',
  TEAM_LEAD:          '/dashboard/lead',
  EMPLOYEE:           '/dashboard/employee',
};

// Routes accessible without authentication
const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/pricing',
  '/portfolio',
  '/careers',
  '/blog',
  '/contact',
  '/auth/client/login',
  '/auth/client/register',
  '/auth/client/verify-otp',
  '/auth/client/verify-email',
  '/auth/client/forgot-password',
  '/auth/internal/login',
  '/auth/internal/mfa-setup',
  '/auth/internal/mfa-verify',
  '/auth/internal/mfa-backup',
  '/auth/reset-password',
];

// Routes each role is authorized to access
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  CLIENT:             ['/dashboard/client'],
  CEO:                ['/dashboard/ceo', '/dashboard/md', '/dashboard/lead', '/dashboard/hr', '/dashboard/employee'],
  MANAGING_DIRECTOR:  ['/dashboard/md', '/dashboard/lead', '/dashboard/hr', '/dashboard/employee'],
  HR:                 ['/dashboard/hr'],
  TEAM_LEAD:          ['/dashboard/lead', '/dashboard/employee'],
  EMPLOYEE:           ['/dashboard/employee'],
};

async function getTokenFromRequest(req: NextRequest): Promise<{ role?: string; authType?: string; tokenVersion?: number } | null> {
  const token = req.cookies.get('routeSessionToken')?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_ROUTE_SESSION_SECRET || 'dummy_route_session_secret'
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string; authType?: string; tokenVersion?: number };
  } catch (error) {
    // Verification failed (expired, invalid signature, etc.)
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static files
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
  const isStaticFile = pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.');

  if (isStaticFile) return NextResponse.next();
  if (isPublicRoute) return NextResponse.next();

  // Protected routes — check auth
  if (pathname.startsWith('/dashboard')) {
    const session = await getTokenFromRequest(request);

    if (!session?.role) {
      // Not authenticated — redirect to appropriate login
      const loginPath = pathname.startsWith('/dashboard/client') 
        ? '/auth/client/login' 
        : '/auth/internal/login';
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Root dashboard — redirect to role-specific dashboard
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      const targetDash = ROLE_DASHBOARD_MAP[session.role];
      if (targetDash) {
        return NextResponse.redirect(new URL(targetDash, request.url));
      }
    }

    // Check role authorization for specific dashboard sections
    const allowedPrefixes = ROLE_ALLOWED_PREFIXES[session.role] || [];
    const isAuthorized = allowedPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (!isAuthorized) {
      // Redirect to user's own dashboard
      const homeDash = ROLE_DASHBOARD_MAP[session.role];
      return NextResponse.redirect(new URL(homeDash || '/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
