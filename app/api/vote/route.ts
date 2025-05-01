import { NextRequest, NextResponse } from 'next/server';
import { insertVote } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, hardcode the voter_fid (will be replaced with actual FID later)
    const voter = 12345; // Placeholder FID
    
    // Extract epoch and design_id from the request
    const { epoch, design_id } = body;
    
    if (!epoch || !design_id) {
      return NextResponse.json(
        { error: 'Missing required fields: epoch and design_id' },
        { status: 400 }
      );
    }
    
    // Insert the vote into the database
    const result = await insertVote({
      voter: voter.toString(), // not sure if we're storing fids or what
      epoch,
      design_id
    });
    
    return NextResponse.json({ success: true, vote: result });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
