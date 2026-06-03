/**
 * "wispr" voice provider — STUB for future Wispr Flow API access.
 *
 * NOT ACTIVE. Wired into the provider map so it can be enabled later by setting
 * NEXT_PUBLIC_VOICE_PROVIDER=wispr, but every call throws until implemented.
 *
 * TODO(wispr): when Wispr Flow API access is available, implement start() to
 * stream mic audio to Wispr and emit transcripts via opts.onText. Likely mirrors
 * api.ts (record → POST to a /api/transcribe variant using WISPR_API_KEY
 * server-side), or a streaming socket if Wispr offers one.
 */

import {VoiceError, type VoiceProvider} from './types';

export const wisprVoiceProvider: VoiceProvider = {
  id: 'wispr',
  streaming: false,
  isSupported: () => false,
  async start() {
    throw new VoiceError('unsupported', 'Wispr Flow provider is not implemented yet');
  }
};
