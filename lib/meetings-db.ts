import type { MeetingType, SacramentMeeting } from './types';

// Server-side fetches need a full URL. Set API_BASE_URL when deploying.
export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-09-27',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Whitmore',
    conducting: 'Brother Aaron Pike',
    announcements: [
      'Ward temple night is Thursday at 7:00 p.m.',
      'Youth service project is Saturday at 9:00 a.m. at the meetinghouse.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Laura Bennett',
    wardBusiness: [
      { description: 'Sustaining of Sister Emma Carlisle as Primary teacher' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Sister Hannah Ellis', topic: 'Trusting the Lord in hard times', type: 'speaker' },
      { name: 'Ellis family', topic: 'Abide with Me!', type: 'musical-number' },
      { name: 'Brother Marcus Doyle', topic: 'The power of daily prayer', type: 'speaker' },
    ],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'Brother Owen Tate',
  },
  {
    id: 2,
    date: '2026-10-11',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Whitmore',
    conducting: 'Brother Thomas Reyes',
    announcements: [
      'Primary program practice is next Sunday after church.',
    ],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Brother Caleb Nash',
    wardBusiness: [
      { description: 'Release of Brother Peter Lund as Sunday School teacher' },
      { description: 'Sustaining of Sister Ruth Alvarez as Sunday School teacher' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [
      { name: 'Brother Peter Lund', topic: 'Lessons from general conference', type: 'speaker' },
      { name: 'Sister Ruth Alvarez', topic: 'Hearing the voice of the prophet', type: 'speaker' },
    ],
    closingHymn: { number: 66, title: 'Rejoice, the Lord Is King!' },
    closingPrayer: 'Sister Grace Holloway',
  },
  {
    id: 3,
    date: '2026-10-18',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Whitmore',
    conducting: 'Brother Aaron Pike',
    announcements: [
      'The ward fall dinner is Friday at 6:00 p.m. in the cultural hall.',
    ],
    openingHymn: { number: 72, title: 'Praise to the Lord, the Almighty' },
    openingPrayer: 'Sister Naomi Fielding',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Elder Jacob Fielding', topic: 'Returning from a mission to Peru', type: 'speaker' },
      { name: 'Primary children', topic: 'I Am a Child of God', type: 'musical-number' },
      { name: 'Sister Naomi Fielding', topic: 'Raising a family of faith', type: 'speaker' },
    ],
    closingHymn: { number: 241, title: 'Count Your Blessings' },
    closingPrayer: 'Brother Isaac Moreno',
  },
  {
    id: 4,
    date: '2026-10-25',
    meetingType: 'stake',
    presiding: 'President Stephen Harwood',
    conducting: 'President Stephen Harwood',
    announcements: [],
    openingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    openingPrayer: 'Sister Margaret Oakes',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 185, title: 'Reverently and Meekly Now' },
    speakers: [
      { name: 'Sister Margaret Oakes', topic: 'Ministering as the Savior did', type: 'speaker' },
      { name: 'Stake choir', topic: 'I Believe in Christ', type: 'musical-number' },
      { name: 'President Stephen Harwood', topic: 'Gathering in unity', type: 'speaker' },
    ],
    closingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    closingPrayer: 'Brother Henry Vance',
  },
  {
    id: 5,
    date: '2026-11-01',
    meetingType: 'testimony',
    presiding: 'Bishop Daniel Whitmore',
    conducting: 'Bishop Daniel Whitmore',
    announcements: [
      'Please bring fast offering donations to a member of the bishopric.',
    ],
    openingHymn: { number: 142, title: 'Sweet Hour of Prayer' },
    openingPrayer: 'Brother Liam Sorensen',
    wardBusiness: [
      { description: 'Baby blessing for Clara Sorensen' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 196, title: 'Jesus, Once of Humble Birth' },
    speakers: [],
    closingHymn: { number: 166, title: 'Abide with Me!' },
    closingPrayer: 'Sister Olivia Grant',
  },
  {
    id: 6,
    date: '2026-11-08',
    meetingType: 'regular',
    presiding: 'Bishop Daniel Whitmore',
    conducting: 'Brother Thomas Reyes',
    announcements: [
      'Thanksgiving food drive starts today. Drop off donations in the foyer.',
      'Ward choir practice is after church in the chapel.',
    ],
    openingHymn: { number: 134, title: 'I Believe in Christ' },
    openingPrayer: 'Sister Claire Dawson',
    wardBusiness: [
      { description: 'Sustaining of Brother Evan Marsh as ward clerk' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: 'O God, the Eternal Father' },
    speakers: [
      { name: 'Sister Amelia Ross', topic: 'Gratitude in all things', type: 'speaker' },
      { name: 'Ward choir', topic: 'Lord, I Would Follow Thee', type: 'musical-number' },
      { name: 'Brother Evan Marsh', topic: 'Serving where we are called', type: 'speaker' },
    ],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Brother Noah Keller',
  },
  {
    id: 7,
    date: '2026-05-03',
    meetingType: 'testimony',
    presiding: 'Bishop Daniel Whitmore',
    conducting: 'Brother Aaron Pike',
    announcements: [
      'Ward spring cleanup is Saturday at 8:00 a.m.',
    ],
    openingHymn: { number: 241, title: 'Count Your Blessings' },
    openingPrayer: 'Sister Julia Warren',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [],
    closingHymn: { number: 220, title: 'Lord, I Would Follow Thee' },
    closingPrayer: 'Brother Simon Hale',
  },
];

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  regular: 'Regular Meeting',
  testimony: 'Testimony Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
};


export function formatMeetingDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function getWardToday(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
}

function getCurrentSundayDate(today: Date = getWardToday()): string {
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {
  return meetings
    .filter((meeting) => !date || meeting.date === date)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  return meetings.find((meeting) => meeting.id === id);
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const currentSunday = getCurrentSundayDate();

  return meetings.find((meeting) => meeting.date === currentSunday);
}
