import { NextResponse } from 'next/server';
import { getAllDesigns, mapToDesignInfo } from '../../../lib/db';

export async function GET() {
  try {
    const designs = await getAllDesigns();
    // Transform the database records to the format expected by the component
    const designInfo = designs.map(mapToDesignInfo);
    return NextResponse.json(designInfo);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}
