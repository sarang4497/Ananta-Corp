/**
 * Cloudflare Turnstile server-side verification. Secret key is server-only.
 *
 * If TURNSTILE_SECRET_KEY is not configured we treat verification as disabled
 * (returns true) so the chat still works in local dev without Turnstile keys.
 * In production with the key set, a missing/invalid token is rejected.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!isTurnstileConfigured()) return true; // dev fallback
  if (!token) return false;

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY as string,
    response: token
  });
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, {method: 'POST', body});
    const data = (await res.json()) as {success?: boolean};
    return data.success === true;
  } catch {
    return false;
  }
}
