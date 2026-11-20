import { NextResponse, type NextRequest } from 'next/server';
import { meetingExists } from '@/lib/meetings-db';

const NOT_IDS = new Set(['current', 'new']);

export async function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/')[2];

  if (NOT_IDS.has(id)) return NextResponse.next();

  if (/^\d+$/.test(id) && (await meetingExists(Number(id)))) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL('/meeting-not-found', request.url));
}

export const config = {
  matcher: '/meetings/:id',
};