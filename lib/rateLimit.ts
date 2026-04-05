import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const nonVerifiedRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

export const verifiedRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1 m"),
});