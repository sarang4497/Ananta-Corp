// Single source of truth for the WhatsApp contact link, shared by the floating
// button and the navbar CTA.

export const WHATSAPP_NUMBER = '918320052838';
export const WHATSAPP_MESSAGE =
  "Hello! I'm interested in your products. Please share price and availability details.";

/**
 * Build a wa.me deep link to our number with a URL-encoded prefilled message.
 *
 * e.g. https://wa.me/918320052838?text=Hello!%20...
 */
export function whatsappUrl(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
