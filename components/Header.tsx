import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import NavLinks from '@/components/NavLinks';
import { WARD_TIMEZONE } from '@/lib/config';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings', matchNested: true },
];

async function CurrentDate() {
  await connection();

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: WARD_TIMEZONE,
  });

  return <p className="min-h-5 text-sm text-muted">{date}</p>;
}

export default function Header() {
  return (
    <header className="border-b border-border bg-surface print:hidden">
      <div className="mx-auto flex w-full max-w-page flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Cedar Ridge Ward
          </Link>
          <Suspense fallback={<p className="min-h-5" />}>
            <CurrentDate />
          </Suspense>
        </div>
        <NavLinks label="Main" links={LINKS} />
      </div>
    </header>
  );
}