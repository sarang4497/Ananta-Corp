/**
 * URL anchor from a service heading — shared by the Industries nav menu and the
 * industry pages so their links and section IDs always match.
 * "QR Digital Menu & Ordering" → "qr-digital-menu-ordering".
 */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
