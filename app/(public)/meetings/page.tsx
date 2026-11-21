import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import Loading from './loading';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getCurrentSundayDate, getMeetings, getMeetingsPageCount } from '@/lib/meetings-db';

export const metadata: Metadata = { title: 'Meetings' };

type SearchParams = PageProps<'/meetings'>['searchParams'];

async function MeetingList({ searchParams }: { searchParams: SearchParams }) {
  await connection();

  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query : '';
  const page = Math.max(1, Math.floor(Number(params.page) || 1));

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, page),
    getMeetingsPageCount(query),
  ]);

  if (totalPages > 0 && page > totalPages) {
    const lastPage = new URLSearchParams();
    if (query) lastPage.set('query', query);
    lastPage.set('page', String(totalPages));
    redirect(`/meetings?${lastPage.toString()}`);
  }

  const currentSunday = getCurrentSundayDate();

  if (meetings.length === 0) {
    return (
      <p className="text-muted">
        {query ? `No meetings match "${query}"` : 'No meetings yet'}
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <MeetingCard meeting={meeting} isCurrent={meeting.date === currentSunday} />
          </li>
        ))}
      </ul>
      <Pagination totalPages={totalPages} />
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