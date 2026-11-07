import type { ReactNode } from 'react';
import { formatMeetingDate, MEETING_TYPE_LABELS } from '@/lib/meetings-db';
import type { Hymn, SacramentMeeting } from '@/lib/types';

function formatHymn({ number, title }: Hymn) {
  return `#${number}: ${title}`;
}

function AgendaSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <h2 className="mb-3">{title}</h2>
      {children}
    </section>
  );
}

function AgendaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-2 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-4">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function AgendaList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted">{empty}</p>;

  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
  return (
    <article className="space-y-4">
      <header className="mb-6">
        <h1>{formatMeetingDate(meeting.date)}</h1>
        <p className="mt-1 text-muted">{MEETING_TYPE_LABELS[meeting.meetingType]}</p>
      </header>

      <AgendaSection title="Leadership">
        <dl>
          <AgendaRow label="Presiding" value={meeting.presiding} />
          <AgendaRow label="Conducting" value={meeting.conducting} />
        </dl>
      </AgendaSection>

      <AgendaSection title="Announcements">
        <AgendaList items={meeting.announcements ?? []} empty="No announcements" />
      </AgendaSection>

      <AgendaSection title="Opening">
        <dl>
          <AgendaRow label="Opening hymn" value={formatHymn(meeting.openingHymn)} />
          <AgendaRow label="Opening prayer" value={meeting.openingPrayer} />
        </dl>
      </AgendaSection>

      <AgendaSection title="Business">
        <h3 className="mb-2">Ward business</h3>
        <AgendaList
          items={meeting.wardBusiness.map((item) => item.description)}
          empty="No ward business"
        />
        <h3 className="mb-2 mt-4">Stake business</h3>
        <p className={meeting.stakeBusiness ? undefined : 'text-muted'}>
          {meeting.stakeBusiness ? 'Stake business will be presented' : 'No stake business'}
        </p>
      </AgendaSection>

      <AgendaSection title="Sacrament">
        <dl>
          <AgendaRow label="Sacrament hymn" value={formatHymn(meeting.sacramentHymn)} />
        </dl>
      </AgendaSection>

      <AgendaSection title="Speakers and music">
        {meeting.speakers.length === 0 ? (
          <p className="text-muted">
            {meeting.meetingType === 'testimony'
              ? 'Testimonies from the congregation'
              : 'No speakers listed'}
          </p>
        ) : (
          <ol className="space-y-3">
            {meeting.speakers.map((item, index) => (
              <li key={index}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {item.type === 'musical-number' ? 'Musical number' : 'Speaker'}
                </p>
                <p className="font-medium">{item.name}</p>
                {item.topic && <p className="text-sm text-muted">{item.topic}</p>}
              </li>
            ))}
          </ol>
        )}
      </AgendaSection>

      <AgendaSection title="Closing">
        <dl>
          <AgendaRow label="Closing hymn" value={formatHymn(meeting.closingHymn)} />
          <AgendaRow label="Closing prayer" value={meeting.closingPrayer} />
        </dl>
      </AgendaSection>
    </article>
  );
}
