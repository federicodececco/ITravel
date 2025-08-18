import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASEURL;
const supabaseKey = import.meta.env.SUPABASEKEY;
const imageBucket = import.meta.env.SUPABASE_BUCKET_IMAGES;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* caricamento delle immagini to supabase */
export const uploadImage = async (file, path) => {
  try {
    /* creazion nome dell'immagine nel db --ex: fileImage.jpg===>>> 4938274650192837_1694783256789.jpg */
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(10).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(imageBucket)
      .upload(filePath, file, { upsert: false });
    if (error) throw error;
    const publicUrl = getPublicUrl(imageBucket, filePath);
    return { ...data, publicUrl, path: filePath };
  } catch (error) {
    console.error('errore caricare foto', error);
    throw error;
  }
};
/* cariacametno multiplo di immagini */
export const uploadMultiImage = async (files, folder = '') => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(10).substring(2)}_${Date.now()}_${index}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}}` : fileName;
      return uploadImage(file, bucket);
    });
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Errore caricamento multiplo:', error);
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

/* crud travels*/

export const createTravel = async (travelData) => {
  try {
    const { data, error } = await supabase
      .from('travels')
      .insert([travelData])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('errore creazione del viaggio con supabase', error);
    throw error;
  }
};
export const getTravels = async (userId = null) => {
  try {
    let query = supabase.from('travels').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore recupero viaggi:', error);
    throw error;
  }
};
export const getTravelById = async (travelId) => {
  try {
    const { data, error } = await supabase
      .from('travels')
      .select(
        `
        *,
        pages (
          id,
          title,
          description,
          cover_image,
          date,
          order_index,
          page_images (
            id,
            image_url,
            order_index
          )
        )
      `,
      )
      .eq('id', travelId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore recupero viaggio:', error);
    throw error;
  }
};
