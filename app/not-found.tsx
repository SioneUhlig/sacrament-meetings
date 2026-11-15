import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1>Page not found</h1>
      <p className="text-muted">
        We couldn&apos;t find that meeting or page.
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