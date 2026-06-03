/**
 * In-memory server-side state for the chat assistant:
 *   - verification codes ({code, expiry, attempts}) keyed by email
 *   - per-visitor answered-turn counters keyed by vid
 *
 * NOTE: this is process-local and ephemeral. It is fine for a single instance
 * and for development, but resets on cold start / redeploy and is NOT shared
 * across serverless instances.
 * TODO(prod): back this with a shared store (e.g. a Marketplace Redis/KV) so
 * codes and counters survive restarts and scale horizontally. The function
 * surface below is intentionally small so the swap is mechanical.
 */

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

interface CodeRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

const codes = new Map<string, CodeRecord>();
const turns = new Map<string, number>(); // vid -> answered turns

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Store a freshly generated code, replacing any prior one for this email. */
export function putCode(email: string, code: string): void {
  codes.set(normalizeEmail(email), {
    code,
    expiresAt: Date.now() + CODE_TTL_MS,
    attempts: 0
  });
}

export type VerifyResult =
  | {ok: true}
  | {ok: false; reason: 'not-found' | 'expired' | 'too-many-attempts' | 'mismatch'};

/** Check a submitted code; consumes the record on success or lockout. */
export function checkCode(email: string, submitted: string): VerifyResult {
  const key = normalizeEmail(email);
  const rec = codes.get(key);
  if (!rec) return {ok: false, reason: 'not-found'};

  if (Date.now() > rec.expiresAt) {
    codes.delete(key);
    return {ok: false, reason: 'expired'};
  }
  if (rec.attempts >= MAX_ATTEMPTS) {
    codes.delete(key);
    return {ok: false, reason: 'too-many-attempts'};
  }

  rec.attempts += 1;
  if (rec.code !== submitted.trim()) {
    if (rec.attempts >= MAX_ATTEMPTS) codes.delete(key);
    return {ok: false, reason: 'mismatch'};
  }

  codes.delete(key); // single-use
  return {ok: true};
}

/** How many turns this visitor has been answered so far. */
export function getTurns(vid: string): number {
  return turns.get(vid) ?? 0;
}

/** Record that one more turn was answered; returns the new count. */
export function incrementTurns(vid: string): number {
  const next = getTurns(vid) + 1;
  turns.set(vid, next);
  return next;
}
