import type { NextRequest } from 'next/server';
import {
  getAllMeetings,
  getMeetings,
  getMeetingsByDate,
  getMeetingsCount,
  PAGE_SIZE,
} from '@/lib/meetings-db';

const MAX_QUERY_LENGTH = 100;
const MAX_PAGE = 100_000;

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

/**
 * GET /api/meetings
 *   ?date=YYYY-MM-DD    -> SacramentMeeting[] for that date
 *   ?query=text         -> SacramentMeeting[] (all matches, no paging)
 *   ?query=text&page=N  -> { meetings, page, pageSize, total, totalPages }
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const query = (searchParams.get('query') ?? '').trim();
  const pageParam = searchParams.get('page');

  if (date !== null && !isValidDate(date)) {
    return badRequest('date must be a real date in YYYY-MM-DD format');
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return badRequest(`query must be ${MAX_QUERY_LENGTH} characters or fewer`);
  }
  if (pageParam !== null) {
    const pageNumber = Number(pageParam);
    if (!/^\d+$/.test(pageParam) || pageNumber < 1 || pageNumber > MAX_PAGE) {
      return badRequest(`page must be a whole number from 1 to ${MAX_PAGE}`);
    }
  }

  try {
    if (date !== null) {
      return Response.json(await getMeetingsByDate(date));
    }

    if (pageParam === null) {
      return Response.json(await getAllMeetings(query));
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
  } catch (error) {
    console.error('API error: failed to load meetings.', error);
    return Response.json({ error: 'Could not load meetings' }, { status: 500 });
  }
}