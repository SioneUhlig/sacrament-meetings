import type { NextAuthConfig } from 'next-auth';

// Pages only bishopric members can open. Everything else stays public.
export function isProtectedPath(pathname: string): boolean {
  return pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit\/?$/.test(pathname);
}

// This file is shared with proxy.ts, so it must not import the database or bcrypt.
export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (isProtectedPath(nextUrl.pathname) && !isLoggedIn) {
        // Send them to the login page, then back here after they sign in.
        const loginUrl = new URL('/login', nextUrl);
        loginUrl.searchParams.set('callbackUrl', `${nextUrl.pathname}${nextUrl.search}`);
        return Response.redirect(loginUrl);
      }

      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;