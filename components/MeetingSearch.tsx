'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); 

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div>
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        placeholder="Search by speaker, leader, meeting type, or month"
        defaultValue={searchParams.get('query') ?? ''}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-md border border-border bg-surface px-3 py-2"
      />
    </div>
  );
}