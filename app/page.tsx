import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <Image
  src="/images/church-hero.jpg"
  alt="Granite sign reading 'The Church of Jesus Christ of Latter-day Saints, Visitors Welcome'"
  width={560}
  height={340}
  sizes="(max-width: 56rem) 100vw, 56rem"
  preload
  className="h-auto w-full rounded-card"
/>
      <div>
        <h1>Welcome to Cedar Ridge Ward</h1>
        <p className="mt-2 text-muted">
          Find this Sunday&apos;s sacrament meeting program or look back at past
          meetings.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/meetings/current"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          This Sunday&apos;s program
        </Link>
        <Link
          href="/meetings"
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent"
        >
          All meetings
        </Link>
      </div>
    </div>
  );
}
