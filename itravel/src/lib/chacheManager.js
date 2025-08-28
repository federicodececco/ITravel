export class CacheManager {
  constructor() {
    this.cache = new Map();
    this.expirationTimes = new Map();
    this.defaultTTL = 5 * 60 * 1000;
    this.maxCacheSize = 100;

    this.startCleanupInterval();
  }

  set(key, value, ttl = this.defaultTTL) {
    if (this.cache.size >= this.maxCacheSize) {
      this.removeOldest();
    }

    const expirationTime = Date.now() + ttl;
    this.cache.set(key, {
      value: JSON.parse(JSON.stringify(value)),
      timestamp: Date.now(),
    });
    this.expirationTimes.set(key, expirationTime);
  }

  get(key) {
    const expiration = this.expirationTimes.get(key);

    if (!expiration || Date.now() > expiration) {
      this.delete(key);

      return null;
    }

    const cached = this.cache.get(key);
    if (cached) {
      return cached.value;
    }

    return null;
  }

  delete(key) {
    this.cache.delete(key);
    this.expirationTimes.delete(key);
  }

  clear() {
    this.cache.clear();
    this.expirationTimes.clear();
  }

  removeOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, data] of this.cache) {
      if (data.timestamp < oldestTime) {
        oldestTime = data.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, expiration] of this.expirationTimes) {
      if (now > expiration) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.delete(key));
  }

  startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.cache.keys()),
    };
  }

  has(key) {
    return this.get(key) !== null;
  }
}
