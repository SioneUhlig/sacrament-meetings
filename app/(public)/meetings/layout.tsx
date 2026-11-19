import { connection } from 'next/server';
import { Suspense } from 'react';
import NavLinks, { type NavLink } from '@/components/NavLinks';
import { getCurrentMeeting } from '@/lib/meetings-db';

function meetingLinks(currentMeetingId?: number): NavLink[] {
  return [
    { href: '/meetings', label: 'All meetings' },
    {
      href: '/meetings/current',
      label: 'This Sunday',
      alsoActiveFor: currentMeetingId ? [`/meetings/${currentMeetingId}`] : [],
    },
  ];
}

async function MeetingsNav() {
  await connection();
  const current = await getCurrentMeeting();

  return <NavLinks label="Meetings" links={meetingLinks(current?.id)} variant="section" />;
}

export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
  return (
    <section className="space-y-6">
      <div className="border-b border-border print:hidden">
        <Suspense fallback={<NavLinks label="Meetings" links={meetingLinks()} variant="section" />}>
          <MeetingsNav />
        </Suspense>
      </div>
      {children}
    </section>
  );
}