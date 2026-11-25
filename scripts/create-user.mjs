// Creates a bishopric account, or resets its password if the email already exists.
//
// Usage (from the project root):
//   node --env-file=.env.local scripts/create-user.mjs "Bishop Smith" bishop@example.com "a-strong-password"

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: node --env-file=.env.local scripts/create-user.mjs "Name" email password');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Use a password with at least 8 characters.');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Run with --env-file=.env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const hash = await bcrypt.hash(password, 10);

const [user] = await sql`
  INSERT INTO users (name, email, password)
  VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${hash})
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password
  RETURNING id, name, email
`;

console.log(`Saved user ${user.id}: ${user.name} <${user.email}>`);