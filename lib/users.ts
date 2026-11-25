import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type User = {
  id: number;
  name: string;
  email: string;
  password: string; // bcrypt hash
};

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await sql`
    SELECT id, name, email, password
    FROM users
    WHERE email = ${email.trim().toLowerCase()}
    LIMIT 1
  `;

  return rows[0] as User | undefined;
}