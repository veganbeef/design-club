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

// A utility function to map database Design to the DesignInfo type used in the UI
export function mapToDesignInfo(design: Design) {
  return {
    title: `Design #${design.design_id}`,
    caption: design.description,
    designerFid: design.designer_fid,
    imageUrl: design.image_url
  };
}

export async function getAllDesigns(): Promise<Design[]> {
  const result = await sql<Design[]>`SELECT * FROM public.designs`;
  return result;
}