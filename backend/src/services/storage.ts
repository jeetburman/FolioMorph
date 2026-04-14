import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const BUCKET = process.env.SUPABASE_BUCKET!;

export async function uploadFileToStorage(
  localFilePath: string,
  storagePath: string,
  contentType: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(localFilePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

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