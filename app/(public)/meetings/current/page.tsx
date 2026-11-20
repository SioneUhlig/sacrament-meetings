import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { getCurrentMeeting } from '@/lib/meetings-db';

async function RedirectToCurrentMeeting(): Promise<null> {
  await connection();

  const meeting = await getCurrentMeeting();

  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}

export default function CurrentMeetingPage() {
  return (
    <Suspense fallback={<p className="text-muted">Finding this Sunday&apos;s meeting...</p>}>
      <RedirectToCurrentMeeting />
    </Suspense>
  );
}
