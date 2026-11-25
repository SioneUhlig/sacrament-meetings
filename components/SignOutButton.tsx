import { signOutAction } from '@/lib/auth-actions';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-accent"
      >
        Sign out
      </button>
    </form>
  );
}