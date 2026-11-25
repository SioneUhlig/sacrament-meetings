import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Bishopric sign-in for managing Cedar Ridge Ward sacrament meetings.',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div>
        <h1>Bishopric sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to create, edit, and delete sacrament meeting programs.
        </p>
      </div>
      {/* LoginForm reads ?callbackUrl from the address bar, so it needs Suspense. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}