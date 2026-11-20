import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MeetingDetail from '@/components/MeetingDetail';
import { formatMeetingDate } from '@/lib/format';
import { getMeetingById } from '@/lib/meetings-db';

export async function generateMetadata({
  params,
}: PageProps<'/meetings/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const meeting = /^\d+$/.test(id) ? await getMeetingById(Number(id)) : undefined;

  return { title: meeting ? formatMeetingDate(meeting.date) : 'Meeting not found' };
}

async function MeetingContent({ params }: Pick<PageProps<'/meetings/[id]'>, 'params'>) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  const meeting = await getMeetingById(Number(id));
  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}

export default function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  return (
    <Suspense fallback={<p className="text-muted">Loading meeting...</p>}>
      <MeetingContent params={params} />
    </Suspense>
  );
}