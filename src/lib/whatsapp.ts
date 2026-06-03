// Single source of truth for the WhatsApp contact link, shared by the floating
// button and the navbar "Let's Talk" CTA.

export const WHATSAPP_NUMBER = '393493262657';
export const WHATSAPP_MESSAGE = 'Hi, I want more information on ';

/**
 * Build a wa.me deep link to our number with a URL-encoded prefilled message.
 * Defaults to the shared opener (trailing space so the user keeps typing).
 *
 * e.g. https://wa.me/393493262657?text=Hi%2C%20I%20want%20more%20information%20on%20
 */
export function whatsappUrl(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
