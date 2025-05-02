import { NextResponse } from 'next/server';
import { getAllDesigns, mapToDesignInfo } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching designs...');
    const designs = await getAllDesigns();
    console.log('Designs fetched:', designs.length);
    console.log('First design with vote count:', designs[0]?.vote_count);
    
    // Transform the database records to the format expected by the component
    const designInfo = designs.map(mapToDesignInfo);
    console.log('First designInfo with voteCount:', designInfo[0]?.voteCount);
    
    return NextResponse.json(designInfo);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}
