/**
 * POST /api/verify — email-verification gate (also captures the lead).
 *
 * Two actions:
 *   { action: 'request', email, consent, turnstileToken }
 *       → Turnstile check, generate a 6-digit code, store it (10-min expiry,
 *         max 5 attempts), email it via Resend. GDPR consent is required.
 *   { action: 'confirm', email, code }
 *       → validate the code; on success set the signed session cookie and
 *         record the verified email as a lead (source: "chat").
 */

import {cookies, headers} from 'next/headers';
import {randomInt} from 'node:crypto';
import {sendVerificationCode} from '@/lib/chat/email';
import {checkCode, putCode} from '@/lib/chat/store';
import {verifyTurnstile} from '@/lib/chat/turnstile';
import {
  cookieOptions,
  newVisitorId,
  signToken,
  verifyToken,
  SESSION_COOKIE,
  VID_COOKIE,
  type SessionPayload
} from '@/lib/chat/session';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface RequestBody {
  action: 'request' | 'confirm';
  email?: string;
  code?: string;
  consent?: boolean;
  turnstileToken?: string;
}

async function ensureVid(): Promise<string> {
  const store = await cookies();
  const existing = verifyToken<{vid: string}>(store.get(VID_COOKIE)?.value);
  if (existing?.vid) return existing.vid;
  const vid = newVisitorId();
  store.set(VID_COOKIE, signToken({vid}), cookieOptions);
  return vid;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ok: false, error: 'invalid-json'}, {status: 400});
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return Response.json({ok: false, error: 'invalid-email'}, {status: 400});
  }

  if (body.action === 'request') {
    if (!body.consent) {
      return Response.json({ok: false, error: 'consent-required'}, {status: 400});
    }

    const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim();
    const human = await verifyTurnstile(body.turnstileToken, ip);
    if (!human) {
      return Response.json({ok: false, error: 'turnstile-failed'}, {status: 403});
    }

    await ensureVid();

    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    putCode(email, code);
    try {
      await sendVerificationCode(email, code);
    } catch (err) {
      console.error('[verify] failed to send code', err);
      return Response.json({ok: false, error: 'send-failed'}, {status: 502});
    }
    return Response.json({ok: true});
  }

  if (body.action === 'confirm') {
    const result = checkCode(email, body.code ?? '');
    if (!result.ok) {
      return Response.json({ok: false, error: result.reason}, {status: 400});
    }

    const vid = await ensureVid();
    const store = await cookies();
    const payload: SessionPayload = {vid, email};
    store.set(SESSION_COOKIE, signToken(payload), cookieOptions);

    // Record the verified email as a lead via the existing /api/lead route.
    try {
      await fetch(new URL('/api/lead', request.url), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, source: 'chat'})
      });
    } catch (err) {
      console.error('[verify] lead capture failed', err);
    }

    return Response.json({ok: true, verified: true});
  }

  return Response.json({ok: false, error: 'unknown-action'}, {status: 400});
}
