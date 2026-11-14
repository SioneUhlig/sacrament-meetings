'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent print:hidden"
    >
      Print program
    </button>
  );
}