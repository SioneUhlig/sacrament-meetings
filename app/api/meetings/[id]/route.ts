import type { NextRequest } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<'/api/meetings/[id]'>
) {
  const { id } = await params;


  if (!/^\d+$/.test(id)) {
    return Response.json({ error: 'Meeting id must be a number' }, { status: 400 });
  }

  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    return Response.json({ error: 'Meeting not found' }, { status: 404 });
  }

  return Response.json(meeting);
}
