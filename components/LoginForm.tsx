'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { authenticate } from '@/lib/auth-actions';

const INPUT_CLASS =
  'w-full rounded-md border border-border bg-surface px-3 py-2 aria-invalid:border-red-700 dark:aria-invalid:border-red-400';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/meetings';
  const [state, formAction, isPending] = useActionState(authenticate, {});
  const errorMessage = state.error;

  return (
    <form action={formAction} className="space-y-4 rounded-card border border-border bg-surface p-5">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          required
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby="login-error"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby="login-error"
          className={INPUT_CLASS}
        />
      </div>

      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <div id="login-error" aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-70"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}