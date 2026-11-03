/**
 * Browser speech helpers for the assistant — voice input (Web Speech
 * recognition) and optional read-aloud (speechSynthesis).
 *
 * Our code sends no audio anywhere: recognition is the browser's own API
 * (some browsers use their vendor's speech service internally — that is the
 * browser's behaviour, not a request from this site). Everything is feature-
 * detected; callers hide the controls when unsupported. Nothing autoplays.
 */

// ── Languages ────────────────────────────────────────────────────────────────
/** Add hi-IN / gu-IN here later; only enabled entries are offered. */
export const LANGS = {
  'en-IN': {label: 'English (India)', enabled: true},
  'hi-IN': {label: 'हिन्दी', enabled: false},
  'gu-IN': {label: 'ગુજરાતી', enabled: false}
} as const;
export type SpeechLang = keyof typeof LANGS;
export const DEFAULT_LANG: SpeechLang = 'en-IN';
export const enabledLangs = (): SpeechLang[] => (Object.keys(LANGS) as SpeechLang[]).filter((l) => LANGS[l].enabled);

// ── Minimal Web Speech typings (not in every TS lib.dom) ─────────────────────
export interface RecognitionAlternative {
  transcript: string;
}
export interface RecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: RecognitionAlternative;
}
export interface RecognitionEvent {
  readonly resultIndex: number;
  readonly results: {readonly length: number; [index: number]: RecognitionResult};
}
export interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: {error: string}) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => Recognition;

export function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor};
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
export const canListen = () => getRecognitionCtor() !== null;

export function createRecognition(lang: SpeechLang = DEFAULT_LANG): Recognition | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor || !LANGS[lang].enabled) return null;
  const r = new Ctor();
  r.lang = lang;
  r.interimResults = true;
  r.continuous = false;
  r.maxAlternatives = 1;
  return r;
}

/** Split a recognition event into the final and interim text so far. */
export function readTranscript(e: RecognitionEvent): {final: string; interim: string} {
  let final = '';
  let interim = '';
  for (let i = 0; i < e.results.length; i++) {
    const r = e.results[i];
    const t = r[0]?.transcript ?? '';
    if (r.isFinal) final += t;
    else interim += t;
  }
  return {final: final.trim(), interim: interim.trim()};
}

/** Friendly text for SpeechRecognition error codes. */
export function speechErrorMessage(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access is blocked. Allow it in your browser settings, or type your question.';
    case 'no-speech':
      return 'I didn’t catch anything. Tap the mic and try again, or type your question.';
    case 'audio-capture':
      return 'No microphone was found. You can type your question instead.';
    case 'network':
      return 'Voice input needs a connection in this browser. Please type your question instead.';
    case 'aborted':
      return '';
    case 'language-not-supported':
      return 'Voice input isn’t available for this language in your browser.';
    default:
      return 'Voice input stopped. Please try again or type your question.';
  }
}

// ── Read aloud ───────────────────────────────────────────────────────────────
export const canSpeak = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

/** Prefer an exact en-IN voice, then any en-* voice, else the browser default. */
export function pickVoice<V extends {lang: string}>(voices: readonly V[], lang: string = DEFAULT_LANG): V | undefined {
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  const want = norm(lang);
  const base = want.split('-')[0];
  return voices.find((v) => norm(v.lang) === want) ?? voices.find((v) => norm(v.lang).startsWith(`${base}-`) || norm(v.lang) === base);
}

/** Plain text for speech: no markdown markers, link text only, no URLs. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/(^|\s)\/[a-z][\w/#?=&-]*/gi, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/\s*\|\s*/g, ', ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.\s*\./g, '.')
    .trim();
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/** Speak a reply (call ONLY from a user gesture). Returns the utterance, or null if unsupported. */
export function speak(text: string, handlers: {onEnd?: () => void} = {}, lang: SpeechLang = DEFAULT_LANG): SpeechSynthesisUtterance | null {
  if (!canSpeak()) return null;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(stripMarkdown(text));
  const voice = pickVoice(synth.getVoices?.() ?? [], lang);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? lang;
  u.rate = 1;
  u.onend = () => handlers.onEnd?.();
  u.onerror = () => handlers.onEnd?.();
  synth.speak(u);
  return u;
}

// ── Preference (show read-aloud controls) ────────────────────────────────────
export const READ_ALOUD_KEY = 'ananta.assistant.readAloud';
export function loadReadAloudPref(): boolean {
  try {
    return window.localStorage.getItem(READ_ALOUD_KEY) !== 'off';
  } catch {
    return true;
  }
}
export function saveReadAloudPref(on: boolean) {
  try {
    window.localStorage.setItem(READ_ALOUD_KEY, on ? 'on' : 'off');
  } catch {
    /* storage blocked — preference lasts for this visit only */
  }
}
