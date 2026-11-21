'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="space-y-4 rounded-card border border-border bg-surface p-5">
      <h2>Something went wrong</h2>
      <p className="text-muted">
        We couldn&apos;t finish loading or saving the meeting. This is usually temporary. Try again,
        or go back to the meetings list.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
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