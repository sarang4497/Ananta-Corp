/**
 * Enquiry (lead) pipeline — pure, testable functions.
 *
 *   visitor submits → validate → record (structured server log, always)
 *   → email notification attempted (Resend) → truthful result
 *
 * The lead is accepted once it is validated AND recorded. Email delivery is
 * attempted afterwards; a failed email never loses the lead: the full record is
 * already in the server log under `[lead:received]` and the failure is logged
 * under `[lead:email-failed]` with the same id, so it can be recovered.
 */

export const DEFAULT_RECIPIENT = 'info@anantacorporation.com';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type LeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  product?: string;
  size?: string;
  /** Finish / décor (quote context). */
  finish?: string;
  category?: string;
  quantity?: string;
  city?: string;
  message?: string;
  source?: string;
  /** Where the quote context came from, e.g. "Product page" (QUOTE_QUERY_KEYS `source`). */
  origin?: string;
  page?: string;
  /** Honeypot — real visitors never fill it. */
  website?: string;
};

export type Lead = Required<Pick<LeadInput, 'name' | 'phone' | 'email'>> &
  Omit<LeadInput, 'name' | 'phone' | 'email' | 'website'> & {id: string; at: string};

const clip = (v: unknown, n = 500) => (typeof v === 'string' ? v.trim().slice(0, n) : undefined) || undefined;

export type Validation = {ok: true; lead: Lead} | {ok: false; error: string};

export function validateLead(body: LeadInput, now = new Date(), id = cryptoId()): Validation {
  if (body.website) return {ok: false, error: 'spam'};
  const email = clip(body.email, 200)?.toLowerCase();
  const name = clip(body.name, 120);
  const phone = clip(body.phone, 40);
  if (!name) return {ok: false, error: 'missing-name'};
  if (!phone || phone.replace(/\D/g, '').length < 8) return {ok: false, error: 'invalid-phone'};
  if (!email || !EMAIL_RE.test(email)) return {ok: false, error: 'invalid-email'};
  return {
    ok: true,
    lead: {
      id,
      at: now.toISOString(),
      name,
      phone,
      email,
      company: clip(body.company, 160),
      product: clip(body.product, 200),
      size: clip(body.size, 60),
      finish: clip(body.finish, 120),
      category: clip(body.category, 120),
      quantity: clip(body.quantity, 160),
      city: clip(body.city, 120),
      message: clip(body.message, 3000),
      source: clip(body.source, 60) ?? 'website',
      origin: clip(body.origin, 120),
      page: clip(body.page, 300)
    }
  };
}

function cryptoId() {
  return `L-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]!);

/** Notification email: concise, every available field, nothing invented. */
export function leadEmail(lead: Lead) {
  const rows: [string, string | undefined][] = [
    ['Name', lead.name],
    ['Company', lead.company],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Product', lead.product],
    ['Selected size', lead.size],
    ['Finish / décor', lead.finish],
    ['Category', lead.category],
    ['Quantity', lead.quantity],
    ['City / site', lead.city],
    ['Message', lead.message],
    ['Request origin', lead.origin],
    ['Source page', lead.page ?? lead.source],
    ['Received', lead.at],
    ['Reference', lead.id]
  ];
  const present = rows.filter((r): r is [string, string] => !!r[1]);
  const who = lead.company ? `${lead.name} / ${lead.company}` : lead.name;
  return {
    subject: `ANANTA — New Enquiry — ${who}`,
    text: present.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html:
      `<div style="font-family:system-ui,sans-serif;color:#121a2f;max-width:560px">` +
      `<p style="font-size:16px;font-weight:600;margin:0 0 12px">New website enquiry</p>` +
      `<table style="border-collapse:collapse;font-size:14px">` +
      present
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#566176;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`
        )
        .join('') +
      `</table><p style="font-size:12px;color:#8a93a6;margin-top:16px">Reply directly to this email to answer the customer.</p></div>`,
    replyTo: lead.email
  };
}

export type EmailResult = {status: 'sent'; providerId?: string} | {status: 'not-configured'} | {status: 'failed'; error: string};

/** Send via Resend REST (no SDK). Never throws. */
export async function sendLeadEmail(lead: Lead, env: Record<string, string | undefined> = process.env, fetchImpl: typeof fetch = fetch): Promise<EmailResult> {
  const key = env.RESEND_API_KEY;
  if (!key) return {status: 'not-configured'};
  const to = (env.LEAD_NOTIFY_TO || DEFAULT_RECIPIENT).split(',').map((s) => s.trim()).filter(Boolean);
  const from = env.LEAD_EMAIL_FROM || env.RESEND_FROM || 'Ananta Website <onboarding@resend.dev>';
  const m = leadEmail(lead);
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from, to, subject: m.subject, text: m.text, html: m.html, reply_to: m.replyTo})
    });
    if (!res.ok) return {status: 'failed', error: `resend ${res.status}: ${(await res.text()).slice(0, 300)}`};
    const json = (await res.json().catch(() => ({}))) as {id?: string};
    return {status: 'sent', providerId: json.id};
  } catch (e) {
    return {status: 'failed', error: e instanceof Error ? e.message : String(e)};
  }
}
