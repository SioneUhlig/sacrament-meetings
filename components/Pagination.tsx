'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  const linkClass =
    'rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent';
  const placeholderClass =
    'rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span aria-hidden="true" className={placeholderClass}>Previous</span>
      )}

      <p className="text-sm">
        Page {currentPage} of {totalPages}
      </p>

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span aria-hidden="true" className={placeholderClass}>Next</span>
      )}
    </nav>
  );
}