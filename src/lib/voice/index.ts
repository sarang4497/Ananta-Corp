/**
 * Voice provider selection. The active provider is a single config value:
 * NEXT_PUBLIC_VOICE_PROVIDER (browser | api | wispr), defaulting to "browser".
 *
 * If the configured provider isn't usable in this browser, we fall back to the
 * free Web Speech provider so the mic still works wherever possible.
 */

import {apiVoiceProvider} from './api';
import {browserVoiceProvider} from './browser';
import {wisprVoiceProvider} from './wispr';
import type {VoiceProvider, VoiceProviderId} from './types';

export * from './types';

const PROVIDERS: Record<VoiceProviderId, VoiceProvider> = {
  browser: browserVoiceProvider,
  api: apiVoiceProvider,
  wispr: wisprVoiceProvider
};

export const VOICE_PROVIDER_ID: VoiceProviderId =
  (process.env.NEXT_PUBLIC_VOICE_PROVIDER as VoiceProviderId) || 'browser';

/**
 * Returns the active provider, falling back to the browser provider when the
 * configured one is unsupported (and the browser one is available).
 */
export function getVoiceProvider(): VoiceProvider {
  const chosen = PROVIDERS[VOICE_PROVIDER_ID] ?? browserVoiceProvider;
  if (!chosen.isSupported() && browserVoiceProvider.isSupported()) {
    return browserVoiceProvider;
  }
  return chosen;
}

/** Whether *any* voice input is usable right now. */
export function isVoiceAvailable(): boolean {
  return getVoiceProvider().isSupported() || browserVoiceProvider.isSupported();
}
