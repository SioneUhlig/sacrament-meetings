import type { SacramentMeeting } from './types';

const NO_HYMN = { number: 0, title: '' };

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: [],
    openingHymn: NO_HYMN,
    openingPrayer: '',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: NO_HYMN,
    speakers: [],
    closingHymn: NO_HYMN,
    closingPrayer: '',
  },
  {
    id: 2,
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: [],
    openingHymn: NO_HYMN,
    openingPrayer: '',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: NO_HYMN,
    speakers: [],
    closingHymn: NO_HYMN,
    closingPrayer: '',
  },
  {
    id: 3,
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: [],
    openingHymn: NO_HYMN,
    openingPrayer: '',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: NO_HYMN,
    speakers: [],
    closingHymn: NO_HYMN,
    closingPrayer: '',
  },
  {
    id: 4,
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: [],
    openingHymn: NO_HYMN,
    openingPrayer: '',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: NO_HYMN,
    speakers: [],
    closingHymn: NO_HYMN,
    closingPrayer: '',
  },
  {
    id: 5,
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: [],
    openingHymn: NO_HYMN,
    openingPrayer: '',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: NO_HYMN,
    speakers: [],
    closingHymn: NO_HYMN,
    closingPrayer: '',
  },
  {
    id: 6,
    date: '',
    meetingType: 'regular',
    presiding: '',
    conducting: '',
    announcements: [],
    openingHymn: NO_HYMN,
    openingPrayer: '',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: NO_HYMN,
    speakers: [],
    closingHymn: NO_HYMN,
    closingPrayer: '',
  },
];

function getCurrentSundayDate(today: Date = new Date()): string {
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7));

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function getAllMeetings(): Promise<SacramentMeeting[]> {
  return [...meetings].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  return meetings.find((meeting) => meeting.id === id);
}


export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const currentSunday = getCurrentSundayDate();
  const allMeetings = await getAllMeetings();

  return (
    allMeetings.find((meeting) => meeting.date === currentSunday) ??
    allMeetings.find((meeting) => meeting.date < currentSunday)
  );
}