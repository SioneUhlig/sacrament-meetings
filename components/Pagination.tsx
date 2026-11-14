'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  const linkClass =
    'rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent';
  const disabledClass =
    'rounded-md border border-border px-4 py-2 text-sm text-muted opacity-50';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>Previous</span>
      )}

      <p className="text-sm">
        Page {currentPage} of {totalPages}
      </p>

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>Next</span>
      )}
    </nav>
  );
}