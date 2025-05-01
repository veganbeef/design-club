import { NextRequest, NextResponse } from 'next/server';
import { insertVote } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    console.log("Received request body:", body); // Debug log
    
    // Extract required fields
    const { voter, epoch, design_id, attestation } = body;
    
    // Validate required fields
    if (epoch === undefined || design_id === undefined) {
      console.error("Missing fields:", { epoch, design_id });
      return NextResponse.json(
        { error: `Missing required fields: epoch and design_id. Received: ${JSON.stringify({ epoch, design_id })}` },
        { status: 400 }
      );
    }
    
    // Insert the vote into the database
    const result = await insertVote({
      voter,
      epoch,
      design_id,
      attestation,
    });
    
    return NextResponse.json({ success: true, vote: result });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
