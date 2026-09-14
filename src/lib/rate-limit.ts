// src/lib/rate-limit.ts
// Simple in-memory rate limiter. Resets on server restart / cold start —
// fine for a hackathon-scale deployment, not a substitute for Redis at scale.

const hits = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(
  key: string,
  limit = 20,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

export function clientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket?.remoteAddress || 'unknown';
}