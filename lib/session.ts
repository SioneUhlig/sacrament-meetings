import { connection } from 'next/server';
import { auth } from '@/auth';
export async function getSession() {
  await connection();
  return auth();
}