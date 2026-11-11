import Link from 'next/link';
import { formatMeetingDate, MEETING_TYPE_LABELS } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const speakers = meeting.speakers
    .filter((item) => item.type === 'speaker')
    .map((item) => item.name);

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
    >
      <article>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2>{formatMeetingDate(meeting.date)}</h2>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-foreground">
            {MEETING_TYPE_LABELS[meeting.meetingType]}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted">Conducting: {meeting.conducting}</p>
        {speakers.length > 0 && (
          <p className="mt-1 text-sm text-muted">
            Speakers: {speakers.join(', ')}
          </p>
        )}
      </article>
    </Link>
  );
}
