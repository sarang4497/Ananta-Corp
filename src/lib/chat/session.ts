/**
 * Signed-cookie helpers for the chat assistant. Two cookies, both httpOnly and
 * HMAC-signed with SESSION_SECRET (never readable or forgeable by the client):
 *
 *   - vid     : a stable visitor id. Used to key turn counting + the one-free-
 *               message gate. Set on the first /api/chat call.
 *   - session : proof of email verification ({vid, email}). Set after a correct
 *               code. /api/chat requires this for every message after the free one.
 *
 * Tokens are `base64url(json).base64url(hmac)`. Tamper-evident, no DB needed.
 */

import {createHmac, randomUUID, timingSafeEqual} from 'node:crypto';

export const VID_COOKIE = 'smi_vid';
export const SESSION_COOKIE = 'smi_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET is not set');
  return s;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payloadJson: string): string {
  return createHmac('sha256', secret()).update(payloadJson).digest('base64url');
}

export function signToken(payload: object): string {
  const json = JSON.stringify(payload);
  return `${b64url(json)}.${sign(json)}`;
}

export function verifyToken<T = Record<string, unknown>>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  let json: string;
  try {
    json = Buffer.from(body, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = sign(json);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export interface SessionPayload {
  vid: string;
  email: string;
}

export function newVisitorId(): string {
  return randomUUID();
}

/** Shared cookie options for our signed cookies. */
export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: COOKIE_MAX_AGE
};
