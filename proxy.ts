import { NextResponse, type NextRequest } from 'next/server';
import { parseMeetingId } from '@/lib/ids';
import { getCurrentMeeting, meetingExists } from '@/lib/meetings-db';


const NOT_FOUND_PATH = '/meeting-not-found';

export async function proxy(request: NextRequest) {
  // /meetings/:id -> ['', 'meetings', ':id']
  const segment = request.nextUrl.pathname.split('/')[2];

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
}


export const config = {
  matcher: '/meetings/:id',
};