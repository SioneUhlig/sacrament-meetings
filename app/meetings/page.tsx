import { Suspense } from 'react';
import Loading from '@/app/meetings/loading';
import MeetingCard from '@/components/MeetingCard';
import { API_BASE_URL } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

async function MeetingList() {
  const response = await fetch(`${API_BASE_URL}/api/meetings`);

  if (!response.ok) {
    throw new Error(`Failed to load meetings: ${response.status}`);
  }

  const meetings: SacramentMeeting[] = await response.json();

  return meetings.map((meeting) => (
    <MeetingCard key={meeting.id} meeting={meeting} />
  ));
}

export default function MeetingsPage() {
  return (
    <div className="space-y-4">
      <h1>Sacrament Meetings</h1>
      <Suspense fallback={<Loading />}>
        <MeetingList />
      </Suspense>
    </div>
  );
}
