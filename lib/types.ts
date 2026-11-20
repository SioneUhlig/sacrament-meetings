export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake'
  | 'general'
  | 'special';

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string; // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn?: Hymn; // Only regular and testimony meetings have the sacrament
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}