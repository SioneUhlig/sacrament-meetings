import { connection } from 'next/server';
import { Suspense } from 'react';
import Loading from './loading';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getCurrentSundayDate, getMeetings, getMeetingsPageCount } from '@/lib/meetings-db';

type SearchParams = PageProps<'/meetings'>['searchParams'];

async function MeetingList({ searchParams }: { searchParams: SearchParams }) {
  await connection();

  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query : '';
  const page = Number(params.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, page),
    getMeetingsPageCount(query),
  ]);

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
      <h1>Sacrament Meetings</h1>
      {/* Both read the URL, so cacheComponents requires them inside Suspense. */}
      <Suspense>
        <MeetingSearch />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <MeetingList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}