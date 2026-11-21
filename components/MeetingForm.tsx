'use client';

import Link from 'next/link';
import { useActionState, type ReactNode } from 'react';
import { MEETING_TYPE_LABELS } from '@/lib/format';
import {
  initialState,
  type MeetingField,
  type MeetingFormValues,
  type State,
} from '@/lib/meeting-form';
import type { MeetingType } from '@/lib/types';

type MeetingFormProps = {
  action: (prevState: State, formData: FormData) => Promise<State>;
  defaultValues?: MeetingFormValues;
  submitLabel: string;
};

const INPUT_CLASS =
  'w-full rounded-md border border-border bg-surface px-3 py-2 aria-invalid:border-red-700 dark:aria-invalid:border-red-400';

const MEETING_TYPES = Object.keys(MEETING_TYPE_LABELS) as MeetingType[];

function FieldErrors({ field, errors }: { field: MeetingField; errors?: string[] }) {
  // The container is always rendered so screen readers are already watching it
  // when an error message appears.
  return (
    <div id={`${field}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      ))}
    </div>
  );
}

function Field({
  field,
  label,
  hint,
  errors,
  children,
}: {
  field: MeetingField;
  label: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={field} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${field}-hint`} className="mb-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      <FieldErrors field={field} errors={errors} />
    </div>
  );
}

function describedBy(field: MeetingField, hasHint = false) {
  return hasHint ? `${field}-hint ${field}-error` : `${field}-error`;
}

export default function MeetingForm({ action, defaultValues = {}, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  // After a failed submit, show what the user typed rather than the original values.
  const values = state.values ?? defaultValues;
  const errors = state.errors ?? {};

  const textInput = (field: MeetingField, extra: { type?: string; required?: boolean } = {}) => (
    <input
      id={field}
      name={field}
      type={extra.type ?? 'text'}
      defaultValue={values[field] ?? ''}
      required={extra.required ?? true}
      aria-invalid={errors[field] ? true : undefined}
      aria-describedby={describedBy(field)}
      className={INPUT_CLASS}
    />
  );

  const textArea = (field: MeetingField) => (
    <textarea
      id={field}
      name={field}
      rows={4}
      defaultValue={values[field] ?? ''}
      aria-invalid={errors[field] ? true : undefined}
      aria-describedby={describedBy(field, true)}
      className={INPUT_CLASS}
    />
  );

  const hymnFields = (
    legend: string,
    numberField: MeetingField,
    titleField: MeetingField,
    options: { required?: boolean; hint?: string } = {}
  ) => {
    const required = options.required ?? true;
    const hintId = `${numberField}-group-hint`;

    return (
      <fieldset
        className="space-y-3 rounded-card border border-border p-4"
        aria-describedby={options.hint ? hintId : undefined}
      >
        <legend className="px-1 text-sm font-semibold">{legend}</legend>
        {options.hint && (
          <p id={hintId} className="text-sm text-muted">
            {options.hint}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <Field field={numberField} label={`${legend} number`} errors={errors[numberField]}>
            <input
              id={numberField}
              name={numberField}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              defaultValue={values[numberField] ?? ''}
              required={required}
              aria-invalid={errors[numberField] ? true : undefined}
              aria-describedby={describedBy(numberField)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field field={titleField} label={`${legend} title`} errors={errors[titleField]}>
            {textInput(titleField, { required })}
          </Field>
        </div>
      </fieldset>
    );
  };

  return (
    <form action={formAction} noValidate className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field field="date" label="Meeting date" errors={errors.date}>
          {textInput('date', { type: 'date' })}
        </Field>

        <Field field="meetingType" label="Meeting type" errors={errors.meetingType}>
          <select
            id="meetingType"
            name="meetingType"
            defaultValue={values.meetingType ?? 'regular'}
            required
            aria-invalid={errors.meetingType ? true : undefined}
            aria-describedby={describedBy('meetingType')}
            className={INPUT_CLASS}
          >
            {MEETING_TYPES.map((type) => (
              <option key={type} value={type}>
                {MEETING_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>

        <Field field="presiding" label="Presiding" errors={errors.presiding}>
          {textInput('presiding')}
        </Field>

        <Field field="conducting" label="Conducting" errors={errors.conducting}>
          {textInput('conducting')}
        </Field>
      </div>

      <Field
        field="announcements"
        label="Announcements"
        hint="Optional. One announcement per line."
        errors={errors.announcements}
      >
        {textArea('announcements')}
      </Field>

      {hymnFields('Opening hymn', 'openingHymnNumber', 'openingHymnTitle')}

      <Field field="openingPrayer" label="Opening prayer" errors={errors.openingPrayer}>
        {textInput('openingPrayer')}
      </Field>

      <Field
        field="wardBusiness"
        label="Ward business"
        hint="Optional. One item per line, for example a release or sustaining."
        errors={errors.wardBusiness}
      >
        {textArea('wardBusiness')}
      </Field>

      <div>
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness === 'on'}
            aria-describedby={describedBy('stakeBusiness')}
            className="size-4 accent-accent"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium">
            Stake business will be presented
          </label>
        </div>
        <FieldErrors field="stakeBusiness" errors={errors.stakeBusiness} />
      </div>

      {hymnFields('Sacrament hymn', 'sacramentHymnNumber', 'sacramentHymnTitle', {
        required: false,
        hint: 'Required for regular and testimony meetings. Leave blank for conferences and special meetings.',
      })}

      <Field
        field="speakers"
        label="Speakers and music"
        hint='One per line, in order. Write speakers as "Name | Topic" and musical numbers as "Music: Performer | Piece".'
        errors={errors.speakers}
      >
        {textArea('speakers')}
      </Field>

      {hymnFields('Closing hymn', 'closingHymnNumber', 'closingHymnTitle')}

      <Field field="closingPrayer" label="Closing prayer" errors={errors.closingPrayer}>
        {textInput('closingPrayer')}
      </Field>

      <div id="form-message" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded-md border border-red-700 px-3 py-2 text-sm text-red-700 dark:border-red-300 dark:text-red-300">
            {state.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-70"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
        <Link
          href="/meetings"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}