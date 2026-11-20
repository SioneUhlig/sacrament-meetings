'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

export type NavLink = {
  href: string;
  label: string;
  matchNested?: boolean;
  alsoActiveFor?: string[];
};

type NavLinksProps = {
  label: string;
  links: NavLink[];
  variant?: 'main' | 'section';
};

const STYLES = {
  main: {
    base: 'rounded-md px-3 py-2',
    active: 'bg-accent text-accent-foreground',
    inactive: 'text-muted hover:bg-accent-soft hover:text-foreground',
  },
  section: {
    base: 'border-b-2 px-1 py-2',
    active: 'border-accent text-foreground',
    inactive: 'border-transparent text-muted hover:border-border hover:text-foreground',
  },
};

function isActive(link: NavLink, pathname: string | null): boolean {
  if (pathname === null) return false;
  return (
    pathname === link.href ||
    (link.matchNested === true && pathname.startsWith(`${link.href}/`)) ||
    (link.alsoActiveFor?.includes(pathname) ?? false)
  );
}

function LinkList({
  links,
  variant,
  pathname,
}: {
  links: NavLink[];
  variant: 'main' | 'section';
  pathname: string | null;
}) {
  const styles = STYLES[variant];

  return (
    <ul className={`flex flex-wrap ${variant === 'main' ? 'gap-1' : 'gap-4'}`}>
      {links.map((link) => {
        const active = isActive(link, pathname);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`block text-sm font-medium transition-colors ${styles.base} ${
                active ? styles.active : styles.inactive
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveLinkList({ links, variant }: { links: NavLink[]; variant: 'main' | 'section' }) {
  return <LinkList links={links} variant={variant} pathname={usePathname()} />;
}

export default function NavLinks({ label, links, variant = 'main' }: NavLinksProps) {
  return (
    <nav aria-label={label}>
      <Suspense fallback={<LinkList links={links} variant={variant} pathname={null} />}>
        <ActiveLinkList links={links} variant={variant} />
      </Suspense>
    </nav>
  );
}