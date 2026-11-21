import { neon } from '@neondatabase/serverless';
import { WARD_TIMEZONE } from './config';
import type { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

export const PAGE_SIZE = 5;

function getWardToday(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: WARD_TIMEZONE }));
}

export function getCurrentSundayDate(today: Date = getWardToday()): string {
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7));

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const MEETING_COLUMNS = sql`
  id,
  to_char(date, 'YYYY-MM-DD') AS date,
  meeting_type    AS "meetingType",
  presiding,
  conducting,
  announcements,
  opening_hymn    AS "openingHymn",
  opening_prayer  AS "openingPrayer",
  ward_business   AS "wardBusiness",
  stake_business  AS "stakeBusiness",
  sacrament_hymn  AS "sacramentHymn",
  speakers,
  closing_hymn    AS "closingHymn",
  closing_prayer  AS "closingPrayer"
`;

function searchCondition(query: string) {
  const pattern = `%${query}%`;

  return sql`
    presiding    ILIKE ${pattern} OR
    conducting   ILIKE ${pattern} OR
    meeting_type ILIKE ${pattern} OR
    to_char(date, 'FMMonth YYYY') ILIKE ${pattern} OR
    EXISTS (
      SELECT 1 FROM jsonb_array_elements(speakers) AS s
      WHERE s->>'name' ILIKE ${pattern}
    )
  `;
}

function meetingOrder() {
  const currentSunday = getCurrentSundayDate();

  return sql`
    date < ${currentSunday},
    CASE WHEN date >= ${currentSunday} THEN date END ASC,
    date DESC
  `;
}

export async function getMeetings(query = '', page = 1): Promise<SacramentMeeting[]> {
  const offset = (Math.max(page, 1) - 1) * PAGE_SIZE;

  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE ${searchCondition(query)}
    ORDER BY ${meetingOrder()}
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `;

  return rows as SacramentMeeting[];
}

export async function getAllMeetings(query = ''): Promise<SacramentMeeting[]> {
  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE ${searchCondition(query)}
    ORDER BY ${meetingOrder()}
  `;

  return rows as SacramentMeeting[];
}

export async function getMeetingsCount(query = ''): Promise<number> {
  const [{ count }] = await sql`
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE ${searchCondition(query)}
  `;

  return Number(count);
}

export async function getMeetingsPageCount(query = ''): Promise<number> {
  return Math.ceil((await getMeetingsCount(query)) / PAGE_SIZE);
}

export async function getMeetingsByDate(date: string): Promise<SacramentMeeting[]> {
  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE date = ${date}::date
  `;

  return rows as SacramentMeeting[];
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE id = ${id}
  `;

  return rows[0] as SacramentMeeting | undefined;
}

export async function meetingExists(id: number): Promise<boolean> {
  const rows = await sql`SELECT 1 FROM meetings WHERE id = ${id} LIMIT 1`;
  return rows.length > 0;
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    SELECT ${MEETING_COLUMNS}
    FROM meetings
    WHERE date = ${getCurrentSundayDate()}::date
    LIMIT 1
  `;

  return rows[0] as SacramentMeeting | undefined;
}

function json(value: unknown): string {
  return JSON.stringify(value);
}

export async function addMeeting(
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  const rows = await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    )
    VALUES (
      ${meeting.date}::date,
      ${meeting.meetingType},
      ${meeting.presiding},
      ${meeting.conducting},
      ${meeting.announcements ?? []}::text[],
      ${json(meeting.openingHymn)}::jsonb,
      ${meeting.openingPrayer},
      ${json(meeting.wardBusiness)}::jsonb,
      ${meeting.stakeBusiness},
      ${meeting.sacramentHymn ? json(meeting.sacramentHymn) : null}::jsonb,
      ${json(meeting.speakers)}::jsonb,
      ${json(meeting.closingHymn)}::jsonb,
      ${meeting.closingPrayer}
    )
    RETURNING ${MEETING_COLUMNS}
  `;

  return rows[0] as SacramentMeeting;
}

export async function updateMeeting(
  id: number,
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    UPDATE meetings
    SET
      date           = ${meeting.date}::date,
      meeting_type   = ${meeting.meetingType},
      presiding      = ${meeting.presiding},
      conducting     = ${meeting.conducting},
      announcements  = ${meeting.announcements ?? []}::text[],
      opening_hymn   = ${json(meeting.openingHymn)}::jsonb,
      opening_prayer = ${meeting.openingPrayer},
      ward_business  = ${json(meeting.wardBusiness)}::jsonb,
      stake_business = ${meeting.stakeBusiness},
      sacrament_hymn = ${meeting.sacramentHymn ? json(meeting.sacramentHymn) : null}::jsonb,
      speakers       = ${json(meeting.speakers)}::jsonb,
      closing_hymn   = ${json(meeting.closingHymn)}::jsonb,
      closing_prayer = ${meeting.closingPrayer}
    WHERE id = ${id}
    RETURNING ${MEETING_COLUMNS}
  `;

  return rows[0] as SacramentMeeting | undefined;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}