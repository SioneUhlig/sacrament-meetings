import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { getCurrentMeeting } from '@/lib/meetings-db';

// proxy.ts normally handles /meetings/current with a real HTTP redirect before
// this page renders. This page is only a fallback if the proxy's lookup fails.
async function RedirectToCurrentMeeting(): Promise<null> {
  await connection();

  const meeting = await getCurrentMeeting();

  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}

export default function CurrentMeetingPage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="text-muted">
          Finding this Sunday&apos;s meeting...
        </p>
      }
    >
      <RedirectToCurrentMeeting />
    </Suspense>
  );
}