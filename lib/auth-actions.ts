'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';

function safeRedirect(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/meetings';
  }
  return value;
}

export type LoginState = { error?: string; email?: string };

export async function authenticate(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email');

  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: safeRedirect(formData.get('redirectTo')),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === 'CredentialsSignin'
            ? 'Invalid email or password.'
            : 'Something went wrong. Please try again.',
        email: typeof email === 'string' ? email : '',
      };
    }
    throw error;
  }

  return {};
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}