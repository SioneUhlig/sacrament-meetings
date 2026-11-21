import type { Hymn, SacramentMeeting, SpeakerItem } from './types';

export const MEETING_FIELDS = [
  'date',
  'meetingType',
  'presiding',
  'conducting',
  'announcements',
  'openingHymnNumber',
  'openingHymnTitle',
  'openingPrayer',
  'wardBusiness',
  'stakeBusiness',
  'sacramentHymnNumber',
  'sacramentHymnTitle',
  'speakers',
  'closingHymnNumber',
  'closingHymnTitle',
  'closingPrayer',
] as const;

export type MeetingField = (typeof MEETING_FIELDS)[number];

export type MeetingFormValues = Partial<Record<MeetingField, string>>;

export type State = {
  message?: string | null;
  errors?: Partial<Record<MeetingField, string[]>>;
  values?: MeetingFormValues;
};

export const initialState: State = { message: null, errors: {} };

const MUSIC_PREFIX = 'Music:';


export function parseSpeakerLine(line: string): SpeakerItem {
  const isMusic = line.toLowerCase().startsWith(MUSIC_PREFIX.toLowerCase());
  const rest = isMusic ? line.slice(MUSIC_PREFIX.length) : line;
  const [name = '', ...topicParts] = rest.split('|');

  return {
    name: name.trim(),
    topic: topicParts.join('|').trim(),
    type: isMusic ? 'musical-number' : 'speaker',
  };
}

function formatSpeakerLine(item: SpeakerItem): string {
  const prefix = item.type === 'musical-number' ? `${MUSIC_PREFIX} ` : '';
  return item.topic ? `${prefix}${item.name} | ${item.topic}` : `${prefix}${item.name}`;
}

export function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function hymnValues(hymn: Hymn | null | undefined) {
  return {
    number: hymn ? String(hymn.number) : '',
    title: hymn?.title ?? '',
  };
}

export function meetingToFormValues(meeting: SacramentMeeting): MeetingFormValues {
  const opening = hymnValues(meeting.openingHymn);
  const sacrament = hymnValues(meeting.sacramentHymn);
  const closing = hymnValues(meeting.closingHymn);

  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: meeting.announcements.join('\n'),
    openingHymnNumber: opening.number,
    openingHymnTitle: opening.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness ? 'on' : '',
    sacramentHymnNumber: sacrament.number,
    sacramentHymnTitle: sacrament.title,
    speakers: meeting.speakers.map(formatSpeakerLine).join('\n'),
    closingHymnNumber: closing.number,
    closingHymnTitle: closing.title,
    closingPrayer: meeting.closingPrayer,
  };
}