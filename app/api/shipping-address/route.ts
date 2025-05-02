import { NextRequest, NextResponse } from 'next/server';
import { insertShippingAddress } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract required fields
    const { wallet_address, attestation } = body;
    
    if (!wallet_address || !attestation) {
      return NextResponse.json(
        { error: 'Missing required fields: wallet_address and attestation' },
        { status: 400 }
      );
    }
    
    // Insert the shipping address into the database
    const result = await insertShippingAddress({
      wallet_address,
      attestation
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error processing shipping address:', error);
    return NextResponse.json(
      { error: 'Failed to save shipping address: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
