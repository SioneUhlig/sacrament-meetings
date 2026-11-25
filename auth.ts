import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/users';

const CredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await getUserByEmail(parsed.data.email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(parsed.data.password, user.password);
        if (!passwordsMatch) return null;

        // Never put the password hash in the session.
        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
});