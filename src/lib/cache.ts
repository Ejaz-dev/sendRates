import redis from "./redis";

const CACHE_TTL = 1800; // 30 minutes in seconds

export interface CacheKey {
  source: string;
  target: string;
  amount: number;
}

function buildKey({ source, target, amount }: CacheKey): string {
  return `rates:${source}:${target}:${amount}`;
}

export async function getCachedRates(key: CacheKey) {
  const data = await redis.get(buildKey(key));
  return data ? JSON.parse(data) : null;
}

export async function setCachedRates(key: CacheKey, rates: unknown) {
  await redis.set(buildKey(key), JSON.stringify(rates), "EX", CACHE_TTL);
}

export async function getLastRefreshTime(): Promise<string | null> {
  return redis.get("rates:last_refresh");
}

export async function setLastRefreshTime() {
  await redis.set("rates:last_refresh", new Date().toISOString());
}