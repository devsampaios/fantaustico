import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'images';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export const isSupabaseEnabled = Boolean(supabase);

export const uploadImage = async (file: File, folder: string) => {
  if (!supabase) {
    console.warn('Supabase não configurado, pulando upload.');
    return '';
  }
  const path = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(supabaseBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    console.error('Erro ao enviar imagem para Supabase', error.message);
    throw error;
  }
  const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(path);
  return data.publicUrl;
};
