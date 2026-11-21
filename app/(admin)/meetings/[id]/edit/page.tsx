import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { formatMeetingDate } from '@/lib/format';
import { parseMeetingId } from '@/lib/ids';
import { meetingToFormValues } from '@/lib/meeting-form';
import { getMeetingById } from '@/lib/meetings-db';

export const metadata: Metadata = { title: 'Edit Meeting' };

async function EditMeetingContent({
  params,
}: Pick<PageProps<'/meetings/[id]/edit'>, 'params'>) {
  const id = parseMeetingId((await params).id);
  if (id === null) notFound();

  const meeting = await getMeetingById(id);
  if (!meeting) notFound();

  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

  return (
    <>
      <p className="text-muted">{formatMeetingDate(meeting.date)}</p>
      <MeetingForm
        action={updateMeetingWithId}
        defaultValues={meetingToFormValues(meeting)}
        submitLabel="Save changes"
      />
    </>
  );
}

export default function EditMeetingPage({ params }: PageProps<'/meetings/[id]/edit'>) {
  return (
    <div className="space-y-6">
      <h1>Edit Meeting</h1>
      <Suspense fallback={<p role="status" className="text-muted">Loading meeting...</p>}>
        <EditMeetingContent params={params} />
      </Suspense>
    </div>
  );
}