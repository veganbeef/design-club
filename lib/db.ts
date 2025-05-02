// This module is intended for server-side use only. Do not import in client-side code.
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Define the Design interface to match the database schema
export interface Design {
    id: number;
    epoch: number;
    design_id: number;
    designer_fid: number;
    image_url: string;
    description: string;
    vote_count: number; // Add vote count field
}

// Interface for vote data
export interface VoteData {
    voter: string;
    epoch: number;
    design_id: number;
    attestation: string;
}

// Update DesignInfo type to include designId and voteCount
export interface DesignInfo {
    title: string;
    caption: string;
    designerFid: number;
    imageUrl: string;
    designId: number; // Added this field to store the design_id
    voteCount: number; // Add vote count field
}

// A utility function to map database Design to the DesignInfo type used in the UI
export function mapToDesignInfo(design: Design): DesignInfo {
    return {
        title: `Design #${design.design_id}`,
        caption: design.description,
        designerFid: design.designer_fid,
        imageUrl: design.image_url,
        designId: design.design_id, // Pass the actual design_id from the database
        voteCount: design.vote_count // Pass the vote count
    };
}

export async function getAllDesigns(): Promise<Design[]> {
    // Update query to join with votes table and count votes for each design
    const result = (await sql`
        SELECT d.*, COUNT(v.id) AS vote_count
        FROM public.designs d
        LEFT JOIN public.votes v ON d.design_id = v.design_id
        GROUP BY d.id
        ORDER BY d.design_id
    `) as Design[];
    return result;
}

// Function to insert a vote into the database
export async function insertVote(voteData: VoteData) {
    const { voter, epoch, design_id, attestation } = voteData;

    try {
        const result = await sql`
      INSERT INTO public.votes (voter, epoch, design_id, attestation, created_at)
      VALUES (${voter}, ${epoch}, ${design_id}, ${attestation}, NOW())
      RETURNING *
    `;
        return result[0];
    } catch (error) {
        console.error('Error inserting vote:', error);
        throw error;
    }
}

// Interface for shipping address data
export interface ShippingAddressData {
    wallet_address: string;
    attestation: string;
}

// Function to insert a shipping address into the database
export async function insertShippingAddress(data: ShippingAddressData) {
    const { wallet_address, attestation } = data;

    try {
        // First check if this wallet already has an address
        const existing = await sql`
            SELECT id FROM public.shipping_addresses 
            WHERE wallet_address = ${wallet_address}
        `;
        
        if (existing.length > 0) {
            // Update existing record
            const result = await sql`
                UPDATE public.shipping_addresses
                SET shipping_address_attestation = ${attestation}
                WHERE wallet_address = ${wallet_address}
                RETURNING *
            `;
            return result[0];
        } else {
            // Insert new record
            const result = await sql`
                INSERT INTO public.shipping_addresses (wallet_address, shipping_address_attestation)
                VALUES (${wallet_address}, ${attestation})
                RETURNING *
            `;
            return result[0];
        }
    } catch (error) {
        console.error('Error inserting shipping address:', error);
        throw error;
    }
}