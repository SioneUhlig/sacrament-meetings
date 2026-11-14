import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MeetingDetail from '@/components/MeetingDetail';
import { API_BASE_URL } from '@/lib/config';
import type { SacramentMeeting } from '@/lib/types';

async function MeetingContent({ params }: Pick<PageProps<'/meetings/[id]'>, 'params'>) {
  const { id } = await params;
  const response = await fetch(`${API_BASE_URL}/api/meetings/${encodeURIComponent(id)}`);

  if (response.status === 400 || response.status === 404) notFound();

  if (!response.ok) {
    throw new Error(`Failed to load meeting: ${response.status}`);
  }

  const meeting: SacramentMeeting = await response.json();

  return <MeetingDetail meeting={meeting} />;
}

export default function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
  return (
    <Suspense fallback={<p className="text-muted">Loading meeting...</p>}>
      <MeetingContent params={params} />
    </Suspense>
  );
}