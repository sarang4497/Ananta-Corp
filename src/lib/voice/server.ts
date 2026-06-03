/**
 * Server-side speech-to-text adapters used by /api/transcribe (the "api" voice
 * provider). Keys live here, server-side only, and are never sent to the client.
 *
 * Swappable behind one interface; the active one is chosen by STT_PROVIDER.
 * Start with OpenAI; Deepgram included as a ready alternative.
 *
 * Server-only: this module reads secret keys from process.env and must only be
 * imported from route handlers (it is — by /api/transcribe).
 */

export interface ServerTranscriber {
  readonly id: string;
  transcribe(audio: Blob, lang?: string): Promise<string>;
}

/** OpenAI transcription (gpt-4o-mini-transcribe / whisper-compatible endpoint). */
const openaiTranscriber: ServerTranscriber = {
  id: 'openai',
  async transcribe(audio, lang) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not set');

    const form = new FormData();
    form.append('file', audio, 'speech.webm');
    form.append('model', 'gpt-4o-mini-transcribe');
    if (lang) form.append('language', lang.split('-')[0]); // "it-IT" -> "it"

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`},
      body: form
    });
    if (!res.ok) {
      throw new Error(`OpenAI STT failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {text?: string};
    return (data.text ?? '').trim();
  }
};

/** Deepgram prerecorded transcription. */
const deepgramTranscriber: ServerTranscriber = {
  id: 'deepgram',
  async transcribe(audio, lang) {
    const key = process.env.DEEPGRAM_API_KEY;
    if (!key) throw new Error('DEEPGRAM_API_KEY is not set');

    const params = new URLSearchParams({model: 'nova-2', smart_format: 'true'});
    if (lang) params.set('language', lang.split('-')[0]);

    const res = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${key}`,
        'Content-Type': audio.type || 'audio/webm'
      },
      body: Buffer.from(await audio.arrayBuffer())
    });
    if (!res.ok) {
      throw new Error(`Deepgram STT failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {
      results?: {channels?: Array<{alternatives?: Array<{transcript?: string}>}>};
    };
    return (data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '').trim();
  }
};

const TRANSCRIBERS: Record<string, ServerTranscriber> = {
  openai: openaiTranscriber,
  deepgram: deepgramTranscriber
};

export function getServerTranscriber(): ServerTranscriber {
  const id = process.env.STT_PROVIDER || 'openai';
  return TRANSCRIBERS[id] ?? openaiTranscriber;
}
