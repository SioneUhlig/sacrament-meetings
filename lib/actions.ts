'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { hasSacrament } from './format';
import { isValidMeetingId } from './ids';
import {
  MEETING_FIELDS,
  parseSpeakerLine,
  splitLines,
  type MeetingField,
  type MeetingFormValues,
  type State,
} from './meeting-form';
import {
  addMeeting,
  deleteMeeting as deleteMeetingFromDb,
  updateMeeting as updateMeetingInDb,
} from './meetings-db';
import type { MeetingType, SacramentMeeting } from './types';

const MEETING_TYPES = ['regular', 'testimony', 'stake', 'general', 'special'] as const satisfies readonly MeetingType[];

const MAX_LIST_LENGTH = 5000;

const requiredName = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `Enter the ${label}.` })
    .max(100, { error: `The ${label} must be 100 characters or fewer.` });

const hymnNumber = (label: string) =>
  z.coerce
    .number({ error: `Enter the ${label} number.` })
    .int({ error: `The ${label} number must be a whole number.` })
    .min(1, { error: `Enter the ${label} number.` })
    .max(9999, { error: `The ${label} number is too large.` });

const hymnTitle = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `Enter the ${label} title.` })
    .max(150, { error: `The ${label} title must be 150 characters or fewer.` });

const lineList = (label: string) =>
  z
    .string()
    .max(MAX_LIST_LENGTH, { error: `${label} must be ${MAX_LIST_LENGTH} characters or fewer.` });

function isSunday(isoDate: string): boolean {
  return new Date(`${isoDate}T00:00:00Z`).getUTCDay() === 0;
}

const sacramentHymnNumber = hymnNumber('sacrament hymn');
const sacramentHymnTitle = hymnTitle('sacrament hymn');

const MeetingFormSchema = z
  .object({
    date: z.iso
      .date({ error: 'Enter a valid meeting date.' })
      .refine(isSunday, { error: 'Choose a Sunday. Sacrament meetings are held on Sundays.' }),
    meetingType: z.enum(MEETING_TYPES, { error: 'Choose a meeting type.' }),
    presiding: requiredName('presiding leader'),
    conducting: requiredName('conducting leader'),
    announcements: lineList('Announcements').transform(splitLines),
    openingHymnNumber: hymnNumber('opening hymn'),
    openingHymnTitle: hymnTitle('opening hymn'),
    openingPrayer: requiredName('opening prayer'),
    wardBusiness: lineList('Ward business').transform(splitLines),
    stakeBusiness: z.string().transform((value) => value === 'on'),
    sacramentHymnNumber: z.string().trim(),
    sacramentHymnTitle: z.string().trim(),
    // Kept as raw text so error messages can point at the real line number.
    speakers: lineList('Speakers and music'),
    closingHymnNumber: hymnNumber('closing hymn'),
    closingHymnTitle: hymnTitle('closing hymn'),
    closingPrayer: requiredName('closing prayer'),
  })
  .superRefine((data, ctx) => {
    if (hasSacrament(data.meetingType)) {
      const number = sacramentHymnNumber.safeParse(data.sacramentHymnNumber);
      if (!number.success) {
        ctx.addIssue({
          code: 'custom',
          path: ['sacramentHymnNumber'],
          message: `${number.error.issues[0].message} Regular and testimony meetings need one.`,
        });
      }
      const title = sacramentHymnTitle.safeParse(data.sacramentHymnTitle);
      if (!title.success) {
        ctx.addIssue({
          code: 'custom',
          path: ['sacramentHymnTitle'],
          message: `${title.error.issues[0].message} Regular and testimony meetings need one.`,
        });
      }
    }

    // Count every line, including blank ones, so "Line 3" matches what the user sees.
    const lines = data.speakers.split(/\r?\n/);
    const missingName = lines.findIndex(
      (line) => line.trim() !== '' && !parseSpeakerLine(line.trim()).name
    );
    if (missingName !== -1) {
      ctx.addIssue({
        code: 'custom',
        path: ['speakers'],
        message: `Line ${missingName + 1} needs a name before the "|".`,
      });
    }
  });

type MeetingFormData = z.infer<typeof MeetingFormSchema>;

function readFormValues(formData: FormData): MeetingFormValues {
  const values: MeetingFormValues = {};
  for (const field of MEETING_FIELDS) {
    const value = formData.get(field);
    values[field] = typeof value === 'string' ? value : '';
  }
  return values;
}

function toMeeting(data: MeetingFormData): Omit<SacramentMeeting, 'id'> {
  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: data.announcements,
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: data.wardBusiness.map((description) => ({ description })),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: hasSacrament(data.meetingType)
      ? { number: Number(data.sacramentHymnNumber), title: data.sacramentHymnTitle }
      : null,
    speakers: splitLines(data.speakers).map(parseSpeakerLine),
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

function validate(formData: FormData) {
  const values = readFormValues(formData);
  const result = MeetingFormSchema.safeParse(values);

  if (!result.success) {
    const state: State = {
      message: 'Some fields need attention. Fix the errors below and submit again.',
      errors: z.flattenError(result.error).fieldErrors as Partial<Record<MeetingField, string[]>>,
      values,
    };
    return { ok: false as const, state };
  }

  return { ok: true as const, meeting: toMeeting(result.data), values };
}

function isDuplicateDate(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

const duplicateDateState = (values: MeetingFormValues): State => ({
  message: 'A meeting already exists for that date.',
  errors: { date: ['A meeting already exists for that date. Choose another Sunday.'] },
  values,
});

export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
  const validated = validate(formData);
  if (!validated.ok) return validated.state;

  try {
    await addMeeting(validated.meeting);
  } catch (error) {
    if (isDuplicateDate(error)) return duplicateDateState(validated.values);
    console.error('Database error: failed to create meeting.', error);
    throw new Error('We could not save the new meeting. Please try again.');
  }
  revalidatePath('/meetings', 'layout');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  prevState: State,
  formData: FormData
): Promise<State> {
  if (!isValidMeetingId(id)) {
    return { message: 'This meeting could not be found.', values: readFormValues(formData) };
  }

  const validated = validate(formData);
  if (!validated.ok) return validated.state;

  let updated: SacramentMeeting | undefined;
  try {
    updated = await updateMeetingInDb(id, validated.meeting);
  } catch (error) {
    if (isDuplicateDate(error)) return duplicateDateState(validated.values);
    console.error(`Database error: failed to update meeting ${id}.`, error);
    throw new Error('We could not save your changes to this meeting. Please try again.');
  }

  if (!updated) {
    return {
      message: 'This meeting no longer exists. It may have been deleted.',
      values: validated.values,
    };
  }

  revalidatePath('/meetings', 'layout');
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  if (!isValidMeetingId(id)) {
    throw new Error('That meeting could not be found.');
  }

  let deleted: boolean;
  try {
    deleted = await deleteMeetingFromDb(id);
  } catch (error) {
    console.error(`Database error: failed to delete meeting ${id}.`, error);
    throw new Error('We could not delete the meeting. Please try again.');
  }

  if (!deleted) {
    console.warn(`Delete requested for meeting ${id}, but it no longer exists.`);
  }

  revalidatePath('/meetings', 'layout');
}