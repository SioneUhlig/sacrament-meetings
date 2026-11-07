import type { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? undefined;
  const meetings = await getMeetings(date);

  return Response.json(meetings);
}
