/**
 * Voice input — swappable provider interface.
 *
 * The chat UI talks to ONE interface (`VoiceProvider`) regardless of how
 * transcription actually happens. Two client implementations ship today:
 *   - browser: Web Speech API, streams interim text, no server, free (default).
 *   - api:     records audio (MediaRecorder) and POSTs it to /api/transcribe.
 * A `wispr` stub is included for future Wispr Flow access (not active).
 *
 * The active provider is chosen by NEXT_PUBLIC_VOICE_PROVIDER (see index.ts).
 */

export type VoiceProviderId = 'browser' | 'api' | 'wispr';

export interface VoiceStartOptions {
  /** BCP-47 language hint, e.g. "it-IT" or "en-US". */
  lang?: string;
  /** Called with transcript updates. `isFinal` marks the settled result. */
  onText: (text: string, isFinal: boolean) => void;
  /** Called when recording actually begins (permission granted, mic live). */
  onStart?: () => void;
  /** Called on any error (permission denied, network, unsupported, …). */
  onError: (error: VoiceError) => void;
}

export type VoiceErrorCode =
  | 'unsupported'
  | 'permission-denied'
  | 'no-speech'
  | 'network'
  | 'aborted'
  | 'unknown';

export class VoiceError extends Error {
  constructor(
    public readonly code: VoiceErrorCode,
    message?: string
  ) {
    super(message ?? code);
    this.name = 'VoiceError';
  }
}

/** A live recording/recognition session. */
export interface VoiceSession {
  /** Stop and finalise; resolves once the final transcript has been emitted. */
  stop: () => Promise<void>;
  /** Abort without producing a transcript. */
  cancel: () => void;
}

export interface VoiceProvider {
  readonly id: VoiceProviderId;
  /** Whether this provider emits interim results as the user speaks. */
  readonly streaming: boolean;
  /** Cheap capability check so the UI can hide the mic if unsupported. */
  isSupported: () => boolean;
  /** Begin a session. */
  start: (opts: VoiceStartOptions) => Promise<VoiceSession>;
}
