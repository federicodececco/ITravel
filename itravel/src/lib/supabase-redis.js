import { searchTravels, getTravels } from './supabase';

const REDIS_BACKEND_URL =
  import.meta.env.VITE_REDIS_BACKEND_URL || 'http://localhost:3001';

class RedisCache {
  constructor() {
    this.fallbackToSupabase = true;
    this.timeout = 5000;
  }

  async fetchWithTimeout(url, options, timeoutMs = this.timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getTravelsFromRedis() {
    try {
      const response = await this.fetchWithTimeout(
        `${REDIS_BACKEND_URL}/api/travels`,
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.cached) {
          return {
            data: result.data,
            cached: true,
            source: 'redis',
          };
        }
      }

      return { data: null, cached: false, source: 'redis-miss' };
    } catch (error) {
      console.error(
        'Redis non disponibile, fallback a Supabase:',
        error.message,
      );
      return { data: null, cached: false, source: 'redis-error' };
    }
  }

  async updateRedisCache(travels) {
    try {
      await this.fetchWithTimeout(`${REDIS_BACKEND_URL}/api/travels/cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ travels }),
      });
    } catch (error) {
      console.error('Errore aggiornamento cache Redis:', error.message);
    }
  }

  async invalidateCache(type = 'all') {
    try {
      await this.fetchWithTimeout(`${REDIS_BACKEND_URL}/api/cache/${type}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Errore invalidazione cache:', error.message);
    }
  }

  async getCacheStats() {
    try {
      const response = await this.fetchWithTimeout(
        `${REDIS_BACKEND_URL}/api/cache/stats`,
      );
      if (response.ok) {
        const result = await response.json();
        return result.success ? result.stats : null;
      }
    } catch (error) {
      console.error('errore recupero stats cache:', error.message);
    }
    return null;
  }
}

const redisCache = new RedisCache();

export const getTravelsCached = async () => {
  try {
    const redisResult = await redisCache.getTravelsFromRedis();

    if (redisResult.cached && redisResult.data) {
      return redisResult.data;
    }

    const supabaseData = await getTravels();
    redisCache.updateRedisCache(supabaseData).catch(console.warn);
    return supabaseData;
  } catch (error) {
    console.error('errore cache redis', error);
    throw error;
  }
};

export const searchTravelsCached = async (query, options = {}) => {
  try {
    return await searchTravels(query, options);
  } catch (error) {
    console.error('Errore searchTravelsCached:', error);
    throw error;
  }
};

export const getTravelsByUserIdCached = async (userId) => {
  try {
    const { getTravelByUserId } = await import('./supabase');
    return await getTravelByUserId(userId);
  } catch (error) {
    console.error(' Errore getTravelsByUserIdCached:', error);
    throw error;
  }
};

export const invalidateCache = {
  all: () => redisCache.invalidateCache('all'),
  travels: () => redisCache.invalidateCache('all'),
  search: () => redisCache.invalidateCache('search'),
  userTravels: (userId) => redisCache.invalidateCache('users'),
  searchResults: () => redisCache.invalidateCache('search'),
};

export const getCacheStats = () => redisCache.getCacheStats();

export default {
  getTravelsCached,
  searchTravelsCached,
  getTravelsByUserIdCached,
  invalidateCache,
  getCacheStats,
};
