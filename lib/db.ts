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
}

// Interface for vote data
export interface VoteData {
  voter: string;
  epoch: number;
  design_id: number;
  attestation: string;
}

// A utility function to map database Design to the DesignInfo type used in the UI
// TODO!  normalize the data to match the DesignInfo type
export function mapToDesignInfo(design: Design) {
  return {
    title: `Design #${design.design_id}`,
    caption: design.description,
    designerFid: design.designer_fid,
    imageUrl: design.image_url
  };
}

export async function getAllDesigns(): Promise<Design[]> {
  const result = (await sql`SELECT * FROM public.designs`) as Design[];
  return result;
}

// Function to insert a vote into the database
export async function insertVote(voteData: VoteData) {
  const { voter, epoch, design_id } = voteData;
  
  try {
    const result = await sql`
      INSERT INTO public.votes (voter, epoch, design_id, created_at)
      VALUES (${voter}, ${epoch}, ${design_id}, NOW())
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error inserting vote:', error);
    throw error;
  }
}