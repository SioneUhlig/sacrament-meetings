import { Suspense } from 'react';
import { getSession } from '@/lib/session';

async function SignedInAs() {
  const session = await getSession();
  return session?.user?.name ? <> &middot; Signed in as {session.user.name}</> : null;
}

export default function AdminLayout({ children }: LayoutProps<'/'>) {
  return (
    <section className="space-y-6">
      <p className="rounded-md bg-accent-soft px-3 py-2 text-sm">
        Leader tools
        <Suspense>
          <SignedInAs />
        </Suspense>
      </p>
      {children}
    </section>
  );
}