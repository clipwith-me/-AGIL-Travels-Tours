import "server-only";

/**
 * Minimal email sender via Resend's REST API (no SDK dependency).
 *
 * Env-driven: if RESEND_API_KEY / EMAIL_FROM aren't set, sends are skipped
 * (logged) rather than failing — so the visa flow works before the client
 * provides an email provider + verified sender domain.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; skipped?: boolean }> {
  if (!isEmailConfigured()) {
    console.log(`[email skipped — not configured] to=${opts.to} subject="${opts.subject}"`);
    return { sent: false, skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`Email send failed (${res.status}): ${body}`);
    return { sent: false };
  }
  return { sent: true };
}

const wrap = (title: string, body: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#0b2137">
    <div style="background:#0b2137;padding:24px 28px;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:18px;font-weight:700">AGIL Travels &amp; Tours</span>
      <div style="color:#e6bd57;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:2px">Your Safety Is Our First Priority</div>
    </div>
    <div style="border:1px solid #eef;border-top:none;padding:28px;border-radius:0 0 12px 12px">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      ${body}
    </div>
  </div>`;

export function visaSubmittedEmail(name: string, reference: string, visaType: string) {
  return {
    subject: `Application received — ${reference}`,
    html: wrap(
      "Application received — under review",
      `<p>Hi ${name},</p>
       <p>Thank you for submitting your <strong>${visaType}</strong> application to AGIL Travels and Tours. Our team is now reviewing it.</p>
       <p>Your reference number is:</p>
       <p style="font-size:20px;font-weight:700;letter-spacing:1px">${reference}</p>
       <p>We'll email you as soon as your application status changes. Please keep this reference for any follow-up.</p>
       <p>— The AGIL Travels team</p>`,
    ),
  };
}

export function visaStatusEmail(
  name: string,
  reference: string,
  status: "under_review" | "approved" | "declined",
) {
  const lines: Record<typeof status, string> = {
    under_review: "Your application is now <strong>under review</strong> by our team.",
    approved:
      "Good news — your application has been <strong>approved</strong>. Our team will be in touch with the next steps.",
    declined:
      "Unfortunately, your application has been <strong>declined</strong>. Our team will reach out to explain and discuss options.",
  };
  return {
    subject: `Update on your application — ${reference}`,
    html: wrap(
      "Application status update",
      `<p>Hi ${name},</p>
       <p>${lines[status]}</p>
       <p>Reference: <strong>${reference}</strong></p>
       <p>— The AGIL Travels team</p>`,
    ),
  };
}
