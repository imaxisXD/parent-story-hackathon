import { getSessionCookie } from 'better-auth/cookies';

import { type NextRequest, NextResponse } from 'next/server';

const signInRoutes = ['/sign-in', '/sign-up'];
const protectedRoute = ['/parent'];

export default async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isSignInRoute = signInRoutes.includes(request.nextUrl.pathname);
  const isProtectedRoute = protectedRoute.includes(request.nextUrl.pathname);

  if (isSignInRoute && !sessionCookie) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next|api/auth).*)', '/', '/trpc(.*)'],
};
