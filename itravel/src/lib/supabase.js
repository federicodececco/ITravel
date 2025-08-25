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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('Utente autenticato:', user);

    if (!user) {
      console.error('Utente non autenticato');
      return;
    }
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

export const uploadMultipleImages = async (files, folder = '', imageData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('user non autenticato');
    }
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

      const newImageData = {
        ...imageData,
        image_url: urlData.publicUrl,
        user_id: user.id,
      };

      const dbEntry = await createNewImageEntry(newImageData);

      return {
        ...data,
        publicUrl: urlData.publicUrl,
        path: filePath,
        dbEntry,
      };
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Errore caricamento multiplo:', error);
    throw error;
  }
};

export const createNewImageEntry = async (imageData) => {
  try {
    const orderedData = {
      travel_id: imageData.travelId,
      profile_id: imageData.user_id,
      page_id: imageData.pageId,
      image_url: imageData.image_url,
      user_id: imageData.user_id,
    };
    console.log('dati finali', orderedData);

    const { data, error } = await supabase
      .from('images')
      .insert([orderedData])
      .select()

      .single();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error(
      "c'è stato un errore con il caricamento delle immagini",
      error,
    );
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
export const getTravelByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('travels')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
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

/* crud pages */
export const createPage = async (pageData) => {
  try {
    const orderedData = {
      title: pageData.title,
      description: pageData.description,
      cover_image: pageData.coverImage,
      latitude: pageData.latitude || null,
      longitude: pageData.longitude || null,
      travel_id: pageData.travelId,
    };

    const { data, error } = await supabase
      .from('pages')
      .insert([orderedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore creazione pagina:', error);
    throw error;
  }
};

export const getPagesByTravelId = async (travelId) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('travel_id', travelId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Errore recupero pagine:', error);
    throw error;
  }
};

export const getPageById = async (pageId) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Errore recupero pagina:', error);
    throw error;
  }
};

export const getImagesForPage = async (pageId) => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Errore recupero immagini pagina:', error);
    throw error;
  }
};

/* ordinati per data, per non creare una double linked list */
export const getPageNavigation = async (pageId, travelId) => {
  try {
    const { data: allPages, error } = await supabase
      .from('pages')
      .select('id')
      .eq('travel_id', travelId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const currentIndex = allPages.findIndex(
      (page) => page.id === parseInt(pageId),
    );

    return {
      hasPrevious: currentIndex > 0,
      hasNext: currentIndex < allPages.length - 1,
      previousPageId: currentIndex > 0 ? allPages[currentIndex - 1].id : null,
      nextPageId:
        currentIndex < allPages.length - 1
          ? allPages[currentIndex + 1].id
          : null,
      currentIndex: currentIndex + 1,
      totalPages: allPages.length,
    };
  } catch (error) {
    console.error('Errore recupero navigazione:', error);
    throw error;
  }
};
