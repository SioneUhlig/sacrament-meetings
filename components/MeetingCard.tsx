import Link from 'next/link';
import { formatMeetingDate, MEETING_TYPE_LABELS } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingCard({
  meeting,
  isCurrent = false,
}: {
  meeting: SacramentMeeting;
  isCurrent?: boolean;
}) {
  const speakers = meeting.speakers
    .filter((item) => item.type === 'speaker')
    .map((item) => item.name);

  return (
    <article className={`relative rounded-card border ${isCurrent ? 'border-accent' : 'border-border'} bg-surface p-5 transition-colors hover:border-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2>
          {/* The ::after overlay stretches the link over the whole card, so the
              card stays clickable while the link's name is just the date. */}
          <Link
            href={`/meetings/${meeting.id}`}
            className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
          >
            {formatMeetingDate(meeting.date)}
          </Link>
        </h2>
        <div className="flex flex-wrap gap-2">
          {isCurrent && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              This Sunday
            </span>
          )}
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-foreground">
            {MEETING_TYPE_LABELS[meeting.meetingType]}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">Conducting: {meeting.conducting}</p>
      {speakers.length > 0 && (
        <p className="mt-1 text-sm text-muted">Speakers: {speakers.join(', ')}</p>
      )}
    </article>
  );
}