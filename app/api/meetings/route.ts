import type { NextRequest } from 'next/server';
import { getMeetings, getMeetingsByDate } from '@/lib/meetings-db';

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  // Rejects dates like 2026-02-31 that look right but don't exist
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
  const page = Math.max(1, Math.floor(Number(searchParams.get('page')) || 1));
  return Response.json(await getMeetings(query, page));
}