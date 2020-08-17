import CacheManager from "cache-manager";

export const cache = CacheManager.caching({ store: "memory", ttl: 86400 });
