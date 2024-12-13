interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly cacheDuration: number;

  constructor(cacheDuration: number) {
    this.cacheDuration = cacheDuration;
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache(API_CONFIG.CACHE_DURATION);