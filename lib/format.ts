import type { Hymn, MeetingType } from './types';

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  regular: 'Regular Meeting',
  testimony: 'Testimony Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
  special: 'Special Meeting',
};

export function hasSacrament(meetingType: MeetingType): boolean {
  return meetingType === 'regular' || meetingType === 'testimony';
}

export function formatMeetingDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatHymn({ number, title }: Hymn): string {
  return `#${number}: ${title}`;
}