'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function tryAgain() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div role="alert" className="space-y-4 rounded-card border border-border bg-surface p-5">
      <h1>Something went wrong</h1>
      <p className="text-muted">
        We couldn&apos;t finish loading or saving the meeting. This is usually temporary. Try again,
        or go back to the meetings list.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={tryAgain}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Try again
        </button>
        <Link
          href="/meetings"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          Back to all meetings
        </Link>
      </div>
    </div>
  );
}