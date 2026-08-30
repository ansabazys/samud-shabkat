/**
 * High-performance client-side in-memory cache with request deduplication & TTL.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ClientCache {
  private cache = new Map<string, CacheEntry<any>>();
  private inFlight = new Map<string, Promise<any>>();

  /**
   * Fetches data with transparent in-memory caching and request deduplication.
   * If an identical request is currently pending, it returns the shared in-flight promise.
   */
  async dedupeAndCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 60_000,
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Deduplicate in-flight promises
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key) as Promise<T>;
    }

    const promise = fetcher()
      .then((data) => {
        if (data !== undefined && data !== null) {
          this.cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
        }
        return data;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  set<T>(key: string, data: T, ttlMs: number = 60_000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
  }

  invalidate(prefix?: string): void {
    if (!prefix) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

export const clientCache = new ClientCache();
