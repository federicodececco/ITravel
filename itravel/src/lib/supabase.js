import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASEURL;
const supabaseKey = import.meta.env.SUPABASEKEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* caricamento delle immagini to supabase */
export const uploadImage = async (file, bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('errore caricare foto', error);
    throw error;
  }
};
/* rimozione immagini da supabase */
export const deleteImage = async (bucket, path) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Errore eliminazione:', error);
    throw error;
  }
};

/* ritorna url pubblico  */
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};
