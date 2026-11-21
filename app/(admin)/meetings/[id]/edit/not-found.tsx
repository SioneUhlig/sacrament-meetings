import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="space-y-4">
      <h1>Meeting not found</h1>
      <p className="text-muted">
        We couldn&apos;t find a meeting with that ID. It may have been deleted, or the link may be
        wrong.
      </p>
      <Link
        href="/meetings"
        className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        Back to all meetings
      </Link>
    </div>
  );
}