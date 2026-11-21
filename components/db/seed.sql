-- Sample data for local development and testing. Run after db/schema.sql.
-- Safe to run more than once: if a meeting already exists on one of these
-- dates, that row is skipped instead of causing an error.

INSERT INTO meetings (
  date, meeting_type, presiding, conducting, announcements,
  opening_hymn, opening_prayer, ward_business, stake_business,
  sacrament_hymn, speakers, closing_hymn, closing_prayer
) VALUES
(
  '2026-11-15', 'regular', 'Bishop Example', 'Brother Sample',
  ARRAY['Ward Christmas party on December 12'],
  '{"number": 2, "title": "The Spirit of God"}', 'Sister Jones',
  '[{"description": "Release of the Primary secretary"}]', FALSE,
  '{"number": 169, "title": "As Now We Take the Sacrament"}',
  '[{"name": "Sister Lee", "topic": "Gratitude", "type": "speaker"},
    {"name": "Primary children", "topic": "I Am a Child of God", "type": "musical-number"},
    {"name": "Brother Kim", "topic": "Service", "type": "speaker"}]',
  '{"number": 85, "title": "How Firm a Foundation"}', 'Brother Smith'
),
(
  '2026-12-06', 'testimony', 'Bishop Example', 'Brother Sample',
  '{}',
  '{"number": 19, "title": "We Thank Thee, O God, for a Prophet"}', 'Sister Brown',
  '[]', FALSE,
  '{"number": 193, "title": "I Stand All Amazed"}',
  '[]',
  '{"number": 152, "title": "God Be with You Till We Meet Again"}', 'Brother Green'
)
ON CONFLICT (date) DO NOTHING;