import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import Loading from './loading';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getCurrentSundayDate, getMeetings, getMeetingsCount, PAGE_SIZE } from '@/lib/meetings-db';

export const metadata: Metadata = { title: 'Meetings' };

type SearchParams = PageProps<'/meetings'>['searchParams'];

function resultSummary(total: number, query: string): string {
  const noun = total === 1 ? 'meeting' : 'meetings';
  if (query) return total === 0 ? `No meetings match "${query}"` : `${total} ${noun} match "${query}"`;
  return total === 0 ? 'No meetings yet' : `${total} ${noun}`;
}

async function MeetingList({ searchParams }: { searchParams: SearchParams }) {
  await connection();

  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query.trim() : '';
  const requestedPage = Math.max(1, Math.floor(Number(params.page) || 1));

  const total = await getMeetingsCount(query);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(totalPages, 1));

  const meetings = total > 0 ? await getMeetings(query, page) : [];
  const currentSunday = getCurrentSundayDate();

  return (
    <>
      {/* Live region so screen-reader users hear the result of each search. */}
      <p role="status" className="text-sm text-muted">
        {resultSummary(total, query)}
      </p>
      {meetings.length > 0 && (
        <>
          <ul className="space-y-4">
            {meetings.map((meeting) => (
              <li key={meeting.id}>
                <MeetingCard meeting={meeting} isCurrent={meeting.date === currentSunday} />
              </li>
            ))}
          </ul>
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </>
  );
}

export default function MeetingsPage({ searchParams }: PageProps<'/meetings'>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1>Sacrament Meetings</h1>
        <Link
          href="/meetings/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          New meeting
        </Link>
      </div>
      <Suspense>
        <MeetingSearch />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <MeetingList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}