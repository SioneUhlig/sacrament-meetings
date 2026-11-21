const MAX_MEETING_ID = 2_147_483_647;

export function isValidMeetingId(id: number): boolean {
  return Number.isSafeInteger(id) && id >= 1 && id <= MAX_MEETING_ID;
}

export function parseMeetingId(value: string | undefined): number | null {
  if (!value || !/^\d{1,10}$/.test(value)) return null;
  const id = Number(value);
  return isValidMeetingId(id) ? id : null;
}