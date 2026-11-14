export const API_BASE_URL =
  process.env.API_BASE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const WARD_TIMEZONE = 'America/Chicago';