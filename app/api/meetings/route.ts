import type { NextRequest } from 'next/server';
import {
  getAllMeetings,
  getMeetings,
  getMeetingsByDate,
  getMeetingsCount,
  PAGE_SIZE,
} from '@/lib/meetings-db';

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  if (date !== null) {
    if (!isValidDate(date)) {
      return Response.json(
        { error: 'date must be a real date in YYYY-MM-DD format' },
        { status: 400 }
      );
    }
    return Response.json(await getMeetingsByDate(date));
  }

  const query = searchParams.get('query') ?? '';
  const pageParam = searchParams.get('page');

  if (pageParam === null) {
    return Response.json(await getAllMeetings(query));
  }

  if (!/^\d+$/.test(pageParam) || Number(pageParam) < 1) {
    return Response.json({ error: 'page must be a whole number of 1 or more' }, { status: 400 });
  }

  const page = Number(pageParam);
  const [meetings, total] = await Promise.all([
    getMeetings(query, page),
    getMeetingsCount(query),
  ]);

  return Response.json({
    meetings,
    page,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}