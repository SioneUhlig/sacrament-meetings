import type { NextRequest } from 'next/server';
import { parseMeetingId } from '@/lib/ids';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<'/api/meetings/[id]'>
) {
  const id = parseMeetingId((await params).id);

  if (id === null) {
    return Response.json({ error: 'Meeting id must be a positive whole number' }, { status: 400 });
  }

  try {
    const meeting = await getMeetingById(id);

    if (!meeting) {
      return Response.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return Response.json(meeting);
  } catch (error) {
    console.error(`API error: failed to load meeting ${id}.`, error);
    return Response.json({ error: 'Could not load the meeting' }, { status: 500 });
  }
}