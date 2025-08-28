import { cacheManager, cacheTTL, getCacheKeys } from '../hooks/useCache';
import { supabase } from './supabase';

export const getTravelsCached = async (options = {}) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.travels();

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    let query = supabase.from('travels').select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `);

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;

    if (useCache) {
      cacheManager.set(cacheKey, data, cacheTTL.medium);
    }

    return data;
  } catch (error) {
    console.error('Errore recupero viaggi globali:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const getTravelsByUserIdCached = async (userId, options = {}) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.userTravels(userId);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    let query = supabase.from('travels').select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `);

    const { data, error } = await query
      .eq('profile_id', userId)
      .order('created_at', {
        ascending: false,
      });

    if (error) throw error;

    if (useCache) {
      cacheManager.set(cacheKey, data, cacheTTL.medium);
    }

    return data;
  } catch (error) {
    console.error('Errore recupero viaggi utente:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const getTravelByIdCached = async (travelId, options = {}) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.travel(travelId);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const { data, error } = await supabase
      .from('travels')
      .select()
      .eq('id', travelId)
      .single();

    if (error) throw error;

    if (useCache) {
      cacheManager.set(cacheKey, data, cacheTTL.long);
    }

    return data;
  } catch (error) {
    console.error('Errore recupero viaggio:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const getPagesByTravelIdCached = async (travelId, options = {}) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.pages(travelId);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('travel_id', travelId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const result = data || [];

    if (useCache) {
      cacheManager.set(cacheKey, result, cacheTTL.medium);
    }

    return result;
  } catch (error) {
    console.error('Errore recupero pagine:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const getPageByIdCached = async (pageId, options = {}) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.page(pageId);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) throw error;

    if (useCache) {
      cacheManager.set(cacheKey, data, cacheTTL.long);
    }

    return data;
  } catch (error) {
    console.error('Errore recupero pagina:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const getImagesForPageCached = async (pageId, options = {}) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.images(pageId);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const result = data || [];

    if (useCache) {
      cacheManager.set(cacheKey, result, cacheTTL.long);
    }

    return result;
  } catch (error) {
    console.error('Errore recupero immagini pagina:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const getPageNavigationCached = async (
  pageId,
  travelId,
  options = {},
) => {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = getCacheKeys.navigation(pageId, travelId);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

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

    const result = {
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

    if (useCache) {
      cacheManager.set(cacheKey, result, cacheTTL.medium);
    }

    return result;
  } catch (error) {
    console.error('Errore recupero navigazione:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const searchTravelsCached = async (searchQuery, options = {}) => {
  const { limit = 50, useCache = true, forceRefresh = false } = options;

  if (!searchQuery || !searchQuery.trim()) {
    return getTravelsCached({ useCache, forceRefresh });
  }

  const cacheKey = getCacheKeys.searchResults(searchQuery);

  if (useCache && !forceRefresh) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const trimmedQuery = searchQuery.trim();
    const escapedQuery = trimmedQuery.replace(/[%_]/g, '\\$&');
    const searchPattern = `%${escapedQuery}%`;

    let query = supabase.from('travels').select(`
      *,
      profiles (
        username,
        avatar_url,
        first_name,
        last_name
      )
    `);

    query = query.or(
      `title.ilike.${searchPattern},description.ilike.${searchPattern},place.ilike.${searchPattern}`,
    );

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const results = data || [];

    const sortedResults = results.sort((a, b) => {
      const queryLower = trimmedQuery.toLowerCase();
      let scoreA = 0,
        scoreB = 0;

      if (a.title && a.title.toLowerCase().includes(queryLower)) {
        scoreA += 10;
        if (a.title.toLowerCase().startsWith(queryLower)) scoreA += 5;
      }
      if (b.title && b.title.toLowerCase().includes(queryLower)) {
        scoreB += 10;
        if (b.title.toLowerCase().startsWith(queryLower)) scoreB += 5;
      }

      if (a.place && a.place.toLowerCase().includes(queryLower)) scoreA += 7;
      if (b.place && b.place.toLowerCase().includes(queryLower)) scoreB += 7;

      if (a.description && a.description.toLowerCase().includes(queryLower))
        scoreA += 3;
      if (b.description && b.description.toLowerCase().includes(queryLower))
        scoreB += 3;

      return scoreB - scoreA;
    });

    if (useCache) {
      cacheManager.set(cacheKey, sortedResults, cacheTTL.short);
    }

    return sortedResults;
  } catch (error) {
    console.error('Errore ricerca viaggi:', error);

    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    throw error;
  }
};

export const invalidateCache = {
  travels: () => {
    cacheManager.delete(getCacheKeys.travels());
  },

  userTravels: (userId) => {
    cacheManager.delete(getCacheKeys.userTravels(userId));
  },

  allTravels: () => {
    const stats = cacheManager.getStats();
    for (const key of stats.keys) {
      if (key.startsWith('travels_list_')) {
        cacheManager.delete(key);
      }
    }
  },

  travel: (travelId) => {
    cacheManager.delete(getCacheKeys.travel(travelId));
  },

  pages: (travelId) => {
    cacheManager.delete(getCacheKeys.pages(travelId));

    const stats = cacheManager.getStats();
    for (const key of stats.keys) {
      if (key.includes(`navigation_`) && key.includes(`_${travelId}`)) {
        cacheManager.delete(key);
      }
    }
  },

  page: (pageId, travelId) => {
    cacheManager.delete(getCacheKeys.page(pageId));
    if (travelId) {
      cacheManager.delete(getCacheKeys.navigation(pageId, travelId));
    }
  },

  images: (pageId) => {
    cacheManager.delete(getCacheKeys.images(pageId));
  },

  searchResults: () => {
    const stats = cacheManager.getStats();
    for (const key of stats.keys) {
      if (key.startsWith('search_')) {
        cacheManager.delete(key);
      }
    }
  },

  all: () => {
    cacheManager.clear();
  },
};

export * from './supabase';
