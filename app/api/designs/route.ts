import { NextResponse } from 'next/server';
import { getAllDesigns } from '../../../lib/db';

export async function GET() {
  try {
    const designs = await getAllDesigns();
    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}
