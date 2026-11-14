import { neon } from '@neondatabase/serverless';
import { WARD_TIMEZONE } from './config';
import type { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

export const PAGE_SIZE = 5;

function getWardToday(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: WARD_TIMEZONE }));
}

// The upcoming Sunday, or today if it is Sunday, as 'YYYY-MM-DD'.
export function getCurrentSundayDate(today: Date = getWardToday()): string {
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7));

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function getMeetings(query = '', page = 1): Promise<SacramentMeeting[]> {
  const pattern = `%${query}%`;
  const offset = (Math.max(page, 1) - 1) * PAGE_SIZE;
  const currentSunday = getCurrentSundayDate();

  const rows = await sql`
    SELECT
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
    FROM meetings
    WHERE
      presiding    ILIKE ${pattern} OR
      conducting   ILIKE ${pattern} OR
      meeting_type ILIKE ${pattern} OR
      to_char(date, 'FMMonth YYYY') ILIKE ${pattern} OR
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(speakers) AS s
        WHERE s->>'name' ILIKE ${pattern}
      )
    ORDER BY
      date < ${currentSunday},
      CASE WHEN date >= ${currentSunday} THEN date END ASC,
      date DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `;

  return rows as SacramentMeeting[];
}

export async function getMeetingsPageCount(query = ''): Promise<number> {
  const pattern = `%${query}%`;

  const [{ count }] = await sql`
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE
      presiding    ILIKE ${pattern} OR
      conducting   ILIKE ${pattern} OR
      meeting_type ILIKE ${pattern} OR
      to_char(date, 'FMMonth YYYY') ILIKE ${pattern} OR
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(speakers) AS s
        WHERE s->>'name' ILIKE ${pattern}
      )
  `;

  return Math.ceil(Number(count) / PAGE_SIZE);
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    SELECT
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
    FROM meetings
    WHERE id = ${id}
  `;

  return rows[0] as SacramentMeeting | undefined;
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    SELECT id FROM meetings WHERE date = ${getCurrentSundayDate()}
  `;

  return rows[0] ? getMeetingById(rows[0].id) : undefined;
}

// Week 04: these get wired to the database when the forms are built.
export async function addMeeting(
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  void meeting;
  throw new Error('addMeeting is not implemented yet');
}

export async function updateMeeting(
  id: number,
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting | undefined> {
  void id;
  void meeting;
  throw new Error('updateMeeting is not implemented yet');
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error('deleteMeeting is not implemented yet');
}