/**
 * POST /api/chat — streaming AI assistant (Opus).
 *
 * Simplest working version: no bot protection / email gating (added later).
 * Reads ANTHROPIC_API_KEY server-side only, assembles the editable Markdown
 * knowledge (src/content/knowledge/*.md) + system prompt as context, and streams
 * the reply as plain text. Accepts conversation history in the request body.
 */
import Anthropic from '@anthropic-ai/sdk';
import {
  FIRST_REPLY_MODEL,
  FOLLOWUP_MODEL,
  MAX_TOKENS,
  MAX_HISTORY,
  MAX_INPUT_CHARS,
  MESSAGE_CAP,
  SYSTEM_PROMPT,
  CAPPED_MESSAGE,
  turnGuidance
} from '@/lib/assistant/config';
import {loadKnowledge} from '@/lib/assistant/knowledge';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FALLBACK =
  "I'm having trouble right now — please reach us on WhatsApp (https://wa.me/393493262657) or book a call at /contact.";

interface ChatRequest {
  messages?: Array<{role?: string; content?: string}>;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(
      '[chat] ANTHROPIC_API_KEY is not set in this environment. Add it to .env.local (local) and to your hosting env vars (production).'
    );
    return Response.json({error: 'not-configured'}, {status: 500});
  }

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({error: 'invalid-json'}, {status: 400});
  }

  const messages = (body.messages ?? [])
    .filter(
      (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    )
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: (m.content as string).slice(0, MAX_INPUT_CHARS)
    }))
    .slice(-MAX_HISTORY);

  const userCount = messages.filter((m) => m.role === 'user').length;
  if (userCount === 0) {
    return Response.json({error: 'no-message'}, {status: 400});
  }

  const encoder = new TextEncoder();

  // Conversation cap: beyond MESSAGE_CAP user turns, return the warm capped
  // message with no AI call (saves cost) — the client switches to the CTA state.
  if (userCount > MESSAGE_CAP) {
    return new Response(CAPPED_MESSAGE, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-chat-capped': 'true'
      }
    });
  }

  const knowledge = await loadKnowledge();
  // Stable block (persona + knowledge) is cached via cache_control so the
  // unchanging context isn't billed at full price every message. The tiny
  // per-turn nudge is appended AFTER the cache breakpoint so it never breaks it.
  type SysBlock = {type: 'text'; text: string; cache_control?: {type: 'ephemeral'}};
  const system: SysBlock[] = [
    {type: 'text', text: SYSTEM_PROMPT},
    {
      type: 'text',
      text: `KNOWLEDGE BASE — answer only from the following:\n\n${knowledge}`,
      cache_control: {type: 'ephemeral'}
    }
  ];
  const guidance = turnGuidance(userCount);
  if (guidance) system.push({type: 'text', text: guidance});

  // The final allowed answer signals the chat is wrapping up; tell the client.
  const isFinal = userCount >= MESSAGE_CAP;

  // Two-model strategy: the FIRST assistant reply (no prior assistant message in
  // the history) uses the high-quality model to hook the visitor; every
  // follow-up uses the fast, cheaper model. The cached system block is identical
  // either way, so prompt caching keeps working per-model.
  const hasPriorAssistant = messages.some((m) => m.role === 'assistant');
  const model = hasPriorAssistant ? FOLLOWUP_MODEL : FIRST_REPLY_MODEL;

  const anthropic = new Anthropic({apiKey});

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        const ms = anthropic.messages.stream({
          model,
          max_tokens: MAX_TOKENS,
          system,
          messages
        });
        ms.on('text', (text) => {
          sent = true;
          controller.enqueue(encoder.encode(text));
        });
        ms.on('error', (err) => console.error('[chat] stream error:', err));
        await ms.finalMessage();
        controller.close();
      } catch (err) {
        // Log the REAL reason (auth 401, model 404, rate limit, network, …) so
        // it's visible in the server console rather than a generic message.
        const e = err as {
          name?: string;
          status?: number;
          message?: string;
          error?: unknown;
        };
        console.error('[chat] generation failed:', {
          name: e?.name,
          status: e?.status,
          message: e?.message,
          model,
          error: e?.error ?? err
        });
        // Surface a graceful message only if nothing has streamed yet.
        if (!sent) {
          try {
            controller.enqueue(encoder.encode(FALLBACK));
          } catch {
            /* controller may already be closed */
          }
        }
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      // On the final allowed answer, tell the client to switch to the CTA state.
      'x-chat-capped': isFinal ? 'true' : 'false'
    }
  });
}
