/**
 * "browser" voice provider — Web Speech API (SpeechRecognition).
 * Free, runs entirely client-side, streams interim results. Default + fallback.
 */

import {
  VoiceError,
  type VoiceErrorCode,
  type VoiceProvider,
  type VoiceSession,
  type VoiceStartOptions
} from './types';

// Minimal typings — Web Speech API isn't in the default TS DOM lib everywhere.
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: {error: string}) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionResultEventLike {
  resultIndex: number;
  results: ArrayLike<{0: {transcript: string}; isFinal: boolean}>;
}

function getCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const browserVoiceProvider: VoiceProvider = {
  id: 'browser',
  streaming: true,

  isSupported() {
    return getCtor() !== null;
  },

  async start(opts: VoiceStartOptions): Promise<VoiceSession> {
    const Ctor = getCtor();
    if (!Ctor) {
      throw new VoiceError('unsupported', 'Web Speech API not available');
    }

    const recognition = new Ctor();
    recognition.lang = opts.lang ?? 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalText = '';
    let ended = false;
    let resolveStop: (() => void) | null = null;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      opts.onText((finalText + interim).trim(), false);
    };

    recognition.onerror = (event) => {
      const map: Record<string, VoiceErrorCode> = {
        'not-allowed': 'permission-denied',
        'service-not-allowed': 'permission-denied',
        'no-speech': 'no-speech',
        network: 'network',
        aborted: 'aborted'
      };
      opts.onError(new VoiceError(map[event.error] ?? 'unknown', event.error));
    };

    recognition.onend = () => {
      ended = true;
      opts.onText(finalText.trim(), true);
      resolveStop?.();
    };

    try {
      recognition.start();
      opts.onStart?.();
    } catch {
      throw new VoiceError('unknown', 'Could not start recognition');
    }

    return {
      stop: () =>
        new Promise<void>((resolve) => {
          if (ended) return resolve();
          resolveStop = resolve;
          recognition.stop();
        }),
      cancel: () => recognition.abort()
    };
  }
};
