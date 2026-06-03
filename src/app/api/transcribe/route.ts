/**
 * POST /api/transcribe — server-side speech-to-text for the "api" voice
 * provider. Accepts multipart/form-data with an `audio` file (+ optional
 * `lang`) and returns { text }. The STT provider key lives server-side only.
 *
 * Requires a verified session — paid STT is gated behind email verification to
 * control cost. The free Web Speech provider needs no server and isn't gated.
 */

import {cookies} from 'next/headers';
import {getServerTranscriber} from '@/lib/voice/server';
import {verifyToken, SESSION_COOKIE, type SessionPayload} from '@/lib/chat/session';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: Request) {
  const session = verifyToken<SessionPayload>((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session?.email) {
    return Response.json({error: 'unauthorized'}, {status: 401});
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({error: 'invalid-form'}, {status: 400});
  }

  const audio = form.get('audio');
  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({error: 'no-audio'}, {status: 400});
  }
  if (audio.size > 15 * 1024 * 1024) {
    return Response.json({error: 'too-large'}, {status: 413});
  }

  const lang = typeof form.get('lang') === 'string' ? (form.get('lang') as string) : undefined;

  try {
    const text = await getServerTranscriber().transcribe(audio, lang);
    return Response.json({text});
  } catch (err) {
    console.error('[transcribe] failed', err);
    return Response.json({error: 'transcription-failed'}, {status: 502});
  }
}
