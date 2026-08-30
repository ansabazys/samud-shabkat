interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private store = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically remove expired entries every 2 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.expiresAt <= now) {
          this.store.delete(key);
        }
      }
    }, 120_000);
    this.cleanupInterval.unref();
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  del(key: string): void {
    this.store.delete(key);
  }

  delPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds = 300,
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetchFn();
    if (fresh !== undefined && fresh !== null) {
      this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  }

  /**
   * Clears all cached catalog data when a product, category, or brand changes
   */
  invalidateCatalog(): void {
    this.delPrefix("products:");
    this.delPrefix("categories:");
    this.delPrefix("brands:");
    this.delPrefix("inventory:");
    console.log("[CacheService] Invalidated all catalog and inventory caches.");
  }
}

export const cacheService = new CacheService();
