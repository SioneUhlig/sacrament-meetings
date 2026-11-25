import Link from 'next/link';
import { getSession } from '@/lib/session';
import SignOutButton from '@/components/SignOutButton';

// Shows "Sign in" to visitors, and the user's name with "Sign out" to the bishopric.
export default async function AuthStatus() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-accent-soft hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-muted">
        Signed in as <span className="font-medium text-foreground">{session.user.name}</span>
      </p>
      <SignOutButton />
    </div>
  );
}