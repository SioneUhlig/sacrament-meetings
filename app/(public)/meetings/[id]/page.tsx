import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MeetingDetail from '@/components/MeetingDetail';
import { formatMeetingDate, MEETING_TYPE_LABELS } from '@/lib/format';
import { parseMeetingId } from '@/lib/ids';
import { getMeetingById } from '@/lib/meetings-db';

export async function generateMetadata({
  params,
}: PageProps<'/meetings/[id]'>): Promise<Metadata> {
  const id = parseMeetingId((await params).id);
  const meeting = id === null ? undefined : await getMeetingById(id);

  if (!meeting) {
    return {
      title: 'Meeting not found',
      description: 'This sacrament meeting program could not be found.',
    };
  }

  const title = formatMeetingDate(meeting.date);
  const speakers = meeting.speakers
    .filter((item) => item.type === 'speaker')
    .map((item) => item.name);
  const description =
    `${MEETING_TYPE_LABELS[meeting.meetingType]} conducted by ${meeting.conducting}.` +
    (speakers.length > 0 ? ` Speakers: ${speakers.join(', ')}.` : '');

  return {
    title,
    description,
    // A page's openGraph replaces the site default, so list the image again.
    openGraph: { title, description, type: 'article', images: '/opengraph-image' },
  };
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