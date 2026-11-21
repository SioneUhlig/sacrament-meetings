-- Schema for the meetings table, matching the live Neon database.
-- The table already exists in production; this file documents it and can
-- recreate it in a fresh database (for example, a Neon branch for testing).

CREATE TABLE IF NOT EXISTS meetings (
  id              SERIAL PRIMARY KEY,
  date            DATE NOT NULL,
  meeting_type    VARCHAR(20) NOT NULL,
  presiding       VARCHAR(255) NOT NULL,
  conducting      VARCHAR(255) NOT NULL,
  announcements   TEXT[] DEFAULT '{}',
  opening_hymn    JSONB NOT NULL,              -- { "number": 2, "title": "..." }
  opening_prayer  VARCHAR(255) NOT NULL,
  ward_business   JSONB DEFAULT '[]',          -- [{ "description": "..." }]
  stake_business  BOOLEAN DEFAULT FALSE,
  sacrament_hymn  JSONB,                       -- null for stake, general and special meetings
  speakers        JSONB DEFAULT '[]',          -- [{ "name", "topic", "type": "speaker" | "musical-number" }]
  closing_hymn    JSONB NOT NULL,
  closing_prayer  VARCHAR(255) NOT NULL,

  -- One meeting per date. The app relies on this (error 23505) to show
  -- "A meeting already exists for that date."
  CONSTRAINT meetings_date_key UNIQUE (date),
  CONSTRAINT meetings_meeting_type_check
    CHECK (meeting_type IN ('testimony', 'regular', 'stake', 'general', 'special'))
);