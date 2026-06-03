/**
 * "api" voice provider — records mic audio with MediaRecorder and POSTs it to
 * /api/transcribe, which calls a paid STT provider server-side (key never
 * touches the client). No interim results; one final transcript on stop.
 */

import {
  VoiceError,
  type VoiceProvider,
  type VoiceSession,
  type VoiceStartOptions
} from './types';

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t));
}

export const apiVoiceProvider: VoiceProvider = {
  id: 'api',
  streaming: false,

  isSupported() {
    return (
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined'
    );
  },

  async start(opts: VoiceStartOptions): Promise<VoiceSession> {
    if (!this.isSupported()) {
      throw new VoiceError('unsupported', 'MediaRecorder not available');
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio: true});
    } catch {
      throw new VoiceError('permission-denied', 'Microphone permission denied');
    }

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? {mimeType} : undefined);
    const chunks: BlobPart[] = [];
    let cancelled = false;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const cleanup = () => stream.getTracks().forEach((t) => t.stop());

    const finished = new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        cleanup();
        if (cancelled) return resolve();

        const blob = new Blob(chunks, {type: mimeType ?? 'audio/webm'});
        try {
          const form = new FormData();
          form.append('audio', blob, 'speech.webm');
          if (opts.lang) form.append('lang', opts.lang);

          const res = await fetch('/api/transcribe', {method: 'POST', body: form});
          if (!res.ok) {
            opts.onError(
              new VoiceError(res.status === 401 ? 'aborted' : 'network', `transcribe ${res.status}`)
            );
            return resolve();
          }
          const data = (await res.json()) as {text?: string};
          opts.onText((data.text ?? '').trim(), true);
        } catch {
          opts.onError(new VoiceError('network', 'Transcription request failed'));
        } finally {
          resolve();
        }
      };
    });

    recorder.start();
    opts.onStart?.();

    return {
      stop: async () => {
        if (recorder.state !== 'inactive') recorder.stop();
        await finished;
      },
      cancel: () => {
        cancelled = true;
        if (recorder.state !== 'inactive') recorder.stop();
        else cleanup();
      }
    };
  }
};
