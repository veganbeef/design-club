// This module is intended for server-side use only. Do not import in client-side code.
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getAllDesigns() {
  const result = await sql`SELECT * FROM public.designs`;
  return result;
}