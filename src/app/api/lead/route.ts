/**
 * POST /api/lead — website enquiry.
 *
 * validate → RECORD (structured log line with the full lead; Vercel runtime
 * logs) → attempt the email notification → respond truthfully.
 * 200 {ok:true, id, email} only after the lead is validated and recorded.
 * `email` is the real delivery state: "sent" | "not-configured" | "failed".
 * Email failure never drops the lead: it is already recorded and the failure
 * is logged as [lead:email-failed] with the same id for recovery.
 */
import {sendLeadEmail, validateLead, type LeadInput} from '@/lib/leads/lead';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: LeadInput;
  try {
    body = (await request.json()) as LeadInput;
  } catch {
    return Response.json({ok: false, error: 'invalid-json'}, {status: 400});
  }
  const v = validateLead(body);
  if (!v.ok) {
    // Honeypot hits get a quiet 200 without being recorded or emailed.
    if (v.error === 'spam') return Response.json({ok: true, id: 'ignored', email: 'skipped'});
    return Response.json({ok: false, error: v.error}, {status: 400});
  }
  const lead = v.lead;
  console.log('[lead:received]', JSON.stringify(lead));

  const result = await sendLeadEmail(lead);
  if (result.status === 'sent') console.log('[lead:email-sent]', JSON.stringify({id: lead.id, providerId: result.providerId}));
  else if (result.status === 'not-configured') console.warn('[lead:email-not-configured]', JSON.stringify({id: lead.id, hint: 'set RESEND_API_KEY (+ LEAD_EMAIL_FROM on a verified domain)'}));
  else console.error('[lead:email-failed]', JSON.stringify({id: lead.id, error: result.error, lead}));

  return Response.json({ok: true, id: lead.id, email: result.status});
}
