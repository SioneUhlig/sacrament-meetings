import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = { title: 'New Meeting' };

export default function NewMeetingPage() {
  return (
    <div className="space-y-6">
      <h1>New Meeting</h1>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" />
    </div>
  );
}