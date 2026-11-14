import type { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') ?? '';
  const page = Number(request.nextUrl.searchParams.get('page')) || 1;
  const meetings = await getMeetings(query, page);

  return Response.json(meetings);
}