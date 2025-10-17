/* Global utility functions yang sering dipakai di test */

export const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export interface RetryOpts {
  retries?: number; // default 2 (total attempts = retries+1)
  initialDelayMs?: number; // default 500
  factor?: number; // default 2 (exponential backoff)
  maxDelayMs?: number; // default 5000
  onRetry?: (error: unknown, attempt: number) => Promise<void> | void;
}

export async function withRetries<T>(fn: (attempt: number) => Promise<T>, opts: RetryOpts = {}): Promise<T> {
  const retries = opts.retries ?? 2;
  let delay = opts.initialDelayMs ?? 500;
  const factor = opts.factor ?? 2;
  const maxDelay = opts.maxDelayMs ?? 5000;

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt++;
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt > retries) throw err;
      if (opts.onRetry) await opts.onRetry(err, attempt);
      await sleep(Math.min(delay, maxDelay));
      delay = Math.min(delay * factor, maxDelay);
    }
  }
}

export interface WaitOpts {
  timeoutMs?: number; // default 10000
  intervalMs?: number; // default 200
  description?: string;
}

export async function waitForCondition(
  predicate: () => Promise<boolean> | boolean,
  { timeoutMs = 10000, intervalMs = 200, description }: WaitOpts = {}
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await Promise.resolve(predicate());
    if (ok) return true;
    await sleep(intervalMs);
  }
  throw new Error(`waitForCondition timeout${description ? `: ${description}` : ''} after ${timeoutMs}ms`);
}

export async function withTiming<T>(fn: () => Promise<T>): Promise<{ result: T; ms: number }> {
  const t0 = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - t0 };
}

export function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function pick<T>(arr: T[]): T {
  if (!arr.length) throw new Error('pick() from empty array');
  return arr[Math.floor(Math.random() * arr.length)];
}

export const nowIso = () => new Date().toISOString();
