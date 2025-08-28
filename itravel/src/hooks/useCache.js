import { useCallback, useEffect, useState, useRef } from 'react';
import { CacheManager } from '../lib/chacheManager';

const cacheManager = new CacheManager();

export const useCache = () => {
  const [cacheStats, setCacheStats] = useState(cacheManager.getStats());

  useEffect(() => {
    const updateStats = () => setCacheStats(cacheManager.getStats());
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const setCache = useCallback((key, value, ttl) => {
    cacheManager.set(key, value, ttl);
    setCacheStats(cacheManager.getStats());
  }, []);

  const getCache = useCallback((key) => {
    const result = cacheManager.get(key);
    setCacheStats(cacheManager.getStats());
    return result;
  }, []);

  const deleteCache = useCallback((key) => {
    cacheManager.delete(key);
    setCacheStats(cacheManager.getStats());
  }, []);

  const clearCache = useCallback(() => {
    cacheManager.clear();
    setCacheStats(cacheManager.getStats());
  }, []);

  return {
    setCache,
    getCache,
    deleteCache,
    clearCache,
    hasCache: useCallback((key) => cacheManager.has(key), []),
    cacheStats,
  };
};

export const useCachedData = (key, fetchFunction, options = {}) => {
  const {
    ttl = 5 * 60 * 1000,
    enableCache = true,
    dependencies = [],
    forceRefresh = false,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCache, setCache } = useCache();

  const fetchFunctionRef = useRef(fetchFunction);
  const optionsRef = useRef(options);

  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
    optionsRef.current = options;
  }, [fetchFunction, options]);

  const fetchData = useCallback(
    async (skipCache = false) => {
      try {
        setLoading(true);
        setError(null);

        if (enableCache && !skipCache && !forceRefresh) {
          const cachedData = getCache(key);
          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return cachedData;
          }
        }

        const freshData = await fetchFunctionRef.current();

        if (enableCache) {
          setCache(key, freshData, ttl);
        }

        setData(freshData);
        return freshData;
      } catch (err) {
        console.error(`Error fetching data for ${key}:`, err);
        setError(err);

        if (enableCache) {
          const cachedData = getCache(key);
          if (cachedData) {
            setData(cachedData);
            return cachedData;
          }
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [key, ttl, enableCache, forceRefresh, getCache, setCache],
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
  }, [key, ...dependencies]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    refetch: refresh,
  };
};

export const getCacheKeys = {
  travels: () => 'travels_list_all',
  userTravels: (userId) => `travels_list_user_${userId}`,

  travel: (id) => `travel_${id}`,

  pages: (travelId) => `pages_travel_${travelId}`,

  page: (pageId) => `page_${pageId}`,

  images: (pageId) => `images_page_${pageId}`,

  profile: (userId) => `profile_${userId}`,

  searchResults: (query) => `search_${query.toLowerCase().trim()}`,

  navigation: (pageId, travelId) => `navigation_${pageId}_${travelId}`,
};

export const cacheTTL = {
  short: 2 * 60 * 1000, // 2 minuti
  medium: 5 * 60 * 1000, // 5 minuti
  long: 15 * 60 * 1000, // 15 minuti
  veryLong: 60 * 60 * 1000, // 1 ora
};

export { cacheManager };
export default useCache;
