import Link from 'next/link';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';
import { deleteMeeting } from '@/lib/actions';
import { formatMeetingDate, MEETING_TYPE_LABELS } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingCard({
  meeting,
  isCurrent = false,
  canManage = false,
}: {
  meeting: SacramentMeeting;
  isCurrent?: boolean;
  canManage?: boolean;
}) {
  const speakers = meeting.speakers
    .filter((item) => item.type === 'speaker')
    .map((item) => item.name);
  const dateLabel = formatMeetingDate(meeting.date);
  const deleteMeetingWithId = deleteMeeting.bind(null, meeting.id);

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
            {dateLabel}
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
      {/* Only signed-in bishopric members see Edit and Delete.
          relative z-10 lifts these controls above the card's stretched link. */}
      {canManage && (
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 print:hidden">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            aria-label={`Edit meeting on ${dateLabel}`}
            className="rounded-md border border-border px-3 py-1 text-sm font-medium hover:border-accent"
          >
            Edit
          </Link>
          <DeleteMeetingButton action={deleteMeetingWithId} meetingLabel={dateLabel} />
        </div>
      )}
    </article>
  );
}