import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { formatMeetingDate } from '@/lib/format';
import { meetingToFormValues } from '@/lib/meeting-form';
import { getMeetingById } from '@/lib/meetings-db';

export const metadata: Metadata = { title: 'Edit Meeting' };

async function EditMeetingContent({
  params,
}: Pick<PageProps<'/meetings/[id]/edit'>, 'params'>) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  const meeting = await getMeetingById(Number(id));
  if (!meeting) notFound();

  // Bind the id from the URL so the action knows which meeting to update.
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