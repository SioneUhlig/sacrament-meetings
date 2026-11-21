'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton({ meetingLabel }: { meetingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Delete meeting on ${meetingLabel}`}
      className="rounded-md border border-red-700 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-70 dark:border-red-300 dark:text-red-300 dark:hover:bg-red-950"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default function DeleteMeetingButton({
  action,
  meetingLabel,
}: {
  action: () => Promise<void>;
  meetingLabel: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting on ${meetingLabel}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton meetingLabel={meetingLabel} />
    </form>
  );
}