import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import { parseMeetingId } from '@/lib/ids';
import { getCurrentMeeting, meetingExists } from '@/lib/meetings-db';

const NOT_FOUND_PATH = '/meeting-not-found';

const { auth } = NextAuth(authConfig);

// auth() runs the `authorized` callback in auth.config.ts first. Signed-out
// visitors to /meetings/new or /meetings/:id/edit are redirected to /login
// before the code below runs.
export const proxy = auth(async (request) => {
  // /meetings/:id -> ['meetings', ':id']
  const parts = request.nextUrl.pathname.split('/').filter(Boolean);

  // Only /meetings/:id needs the checks below.
  if (parts[0] !== 'meetings' || parts.length !== 2) return NextResponse.next();

  const segment = parts[1];
  if (segment === 'new') return NextResponse.next();

  if (segment === 'current') {
    try {
      const meeting = await getCurrentMeeting();
      const target = meeting ? `/meetings/${meeting.id}` : '/meetings';
      return NextResponse.redirect(new URL(target, request.url));
    } catch (error) {
      console.error('Proxy: could not look up the current meeting.', error);
      return NextResponse.next();
    }
  }

  const id = parseMeetingId(segment);
  if (id === null) {
    return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
  }

  try {
    if (await meetingExists(id)) return NextResponse.next();
  } catch (error) {
    console.error(`Proxy: could not check whether meeting ${id} exists.`, error);
    // Don't take the page down because of the check; the page calls notFound() itself.
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
});

export const config = {
  matcher: ['/meetings/:path*', '/login'],
};