import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MeetingDetail from '@/components/MeetingDetail';
import { formatMeetingDate } from '@/lib/format';
import { parseMeetingId } from '@/lib/ids';
import { getMeetingById } from '@/lib/meetings-db';

export async function generateMetadata({
  params,
}: PageProps<'/meetings/[id]'>): Promise<Metadata> {
  const id = parseMeetingId((await params).id);
  const meeting = id === null ? undefined : await getMeetingById(id);

  return { title: meeting ? formatMeetingDate(meeting.date) : 'Meeting not found' };
}

async function MeetingContent({ params }: Pick<PageProps<'/meetings/[id]'>, 'params'>) {
  const id = parseMeetingId((await params).id);
  if (id === null) notFound();

  const meeting = await getMeetingById(id);
  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}

export default function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  return (
    <Suspense fallback={<p role="status" className="text-muted">Loading meeting...</p>}>
      <MeetingContent params={params} />
    </Suspense>
  );
}