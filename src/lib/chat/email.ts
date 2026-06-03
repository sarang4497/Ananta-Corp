/**
 * Email sending via Resend (RESEND_API_KEY, server-only). Plain fetch — no SDK
 * dependency. Used to deliver the 6-digit verification code and to notify the
 * team of a new lead.
 */

const RESEND_URL = 'https://api.resend.com/emails';

function from(): string {
  return process.env.RESEND_FROM || 'Ananta Corporation <onboarding@resend.dev>';
}

async function send(payload: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Dev fallback: don't hard-fail if email isn't configured.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[email] RESEND_API_KEY not set — skipping send:', payload.subject);
      return;
    }
    throw new Error('RESEND_API_KEY is not set');
  }

  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({from: from(), ...payload})
  });
  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status} ${await res.text()}`);
  }
}

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  await send({
    to: email,
    subject: `${code} is your Ananta Corporation code`,
    text: `Your verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family:system-ui,sans-serif;color:#15183b;max-width:480px">
        <p>Your verification code is:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:6px;color:#4f46e5">${code}</p>
        <p style="color:#5b6385">It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>`
  });
}

/** Optional: notify the team that a new lead verified via chat. */
export async function notifyNewLead(email: string): Promise<void> {
  const to = process.env.LEAD_NOTIFY_TO;
  if (!to) return;
  try {
    await send({
      to,
      subject: `New chat lead: ${email}`,
      text: `A visitor verified their email via the site chat: ${email}`,
      html: `<p>A visitor verified their email via the site chat: <strong>${email}</strong></p>`
    });
  } catch (err) {
    console.error('[email] lead notification failed', err);
  }
}
