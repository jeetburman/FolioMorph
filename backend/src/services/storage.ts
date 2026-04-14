import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

const BUCKET = process.env.SUPABASE_BUCKET!;

export async function uploadFileToStorage(
  localFilePath: string,
  storagePath: string,
  contentType: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(localFilePath);
  const uint8Array = new Uint8Array(fileBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, uint8Array, {
      contentType,
      upsert: true,
      duplex: 'half',
    } as any);

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function deleteFileFromStorage(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}