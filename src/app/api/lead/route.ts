/**
 * POST /api/lead — capture a lead.
 *
 * Used by the chat flow (source: "chat") when an email is verified and by the
 * inline lead form at the conversion gate. Also reusable by the contact form.
 *
 * For now leads are logged and (optionally) emailed to the team. There is no
 * CRM/database yet.
 * TODO(leads): persist to a database or forward to a CRM (HubSpot, Pipedrive…).
 */

import {notifyNewLead} from '@/lib/chat/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export interface LeadPayload {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return Response.json({ok: false, error: 'invalid-json'}, {status: 400});
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return Response.json({ok: false, error: 'invalid-email'}, {status: 400});
  }

  const lead = {
    email,
    name: body.name?.trim() || undefined,
    phone: body.phone?.trim() || undefined,
    company: body.company?.trim() || undefined,
    message: body.message?.trim() || undefined,
    source: body.source?.trim() || 'unknown',
    at: new Date().toISOString()
  };

  // TODO(leads): replace this with real persistence / CRM forwarding.
  console.log('[lead]', lead);

  // Fire-and-forget team notification (no-op if LEAD_NOTIFY_TO unset).
  void notifyNewLead(email);

  return Response.json({ok: true});
}
