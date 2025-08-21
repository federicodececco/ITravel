import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const imageBucket = 'travel-images';
const avatarBucket = 'avatar-images';
export const supabase = createClient(supabaseUrl, supabaseKey);

export const updateProfile = async (profileData, userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        username: profileData.username,
        avatar_url: profileData.avatarUrl,
      })
      .select()
      .eq('id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('errore updateing profile', error);
    throw error;
  }
};

export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .limit(1)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('errore fetching profilo');
    throw error;
  }
};

/* caricamento delle immagini to supabase */
export const uploadAvatarImage = async (file, folder = '') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    console.log('Upload - Bucket:', avatarBucket, 'Path:', filePath);

    const { data, error } = await supabase.storage
      .from(avatarBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Errore Supabase Storage:', error);
      throw error;
    }

    // Genera l'URL pubblico corretto
    const { data: urlData } = supabase.storage
      .from(avatarBucket)
      .getPublicUrl(filePath);

    console.log('URL generato:', urlData.publicUrl);

    return {
      ...data,
      publicUrl: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Errore durante il caricamento della foto:', error);
    throw error;
  }
};

export const uploadImage = async (file, folder = '') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    console.log('Upload - Bucket:', imageBucket, 'Path:', filePath);

    const { data, error } = await supabase.storage
      .from(imageBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Errore Supabase Storage:', error);
      throw error;
    }

    // Genera l'URL pubblico corretto
    const { data: urlData } = supabase.storage
      .from(imageBucket)
      .getPublicUrl(filePath);

    console.log('URL generato:', urlData.publicUrl);

    return {
      ...data,
      publicUrl: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Errore durante il caricamento della foto:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files, folder = '') => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}_${index}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(imageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(imageBucket)
        .getPublicUrl(filePath);

      return {
        ...data,
        publicUrl: urlData.publicUrl,
        path: filePath,
      };
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
export const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(imageBucket).getPublicUrl(path);
  return data.publicUrl;
};

/* crud travels*/

export const createTravel = async (travelData) => {
  try {
    const orderedData = {
      cover_image: travelData.coverImage,
      description: travelData.description,
      start_date: travelData.startDate,

      place: travelData.location,
      title: travelData.title,
      profile_id: travelData.user_id,
    };
    if (travelData.endDate != '') {
      orderedData.end_date = travelData.endDate;
    }

    const { data, error } = await supabase
      .from('travels')
      .insert([orderedData])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('errore creazione del viaggio con supabase', error);
    throw error;
  }
};
export const getTravels = async () => {
  try {
    let query = supabase.from('travels').select('*');

    /*  if (userId) {
      query = query.eq('user_id', userId);
    } */

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Errore query database:', error);
      throw error;
    }

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
      .select()
      .eq('id', travelId)
      .single();
    console.log(data);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore recupero viaggio:', error);
    throw error;
  }
};
