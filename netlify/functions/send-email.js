// netlify/functions/send-email.js
export default async (req, context) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405 });
    }

    const body = await req.json().catch(() => ({}));
    const { toCustomer, toAdmin, customer = {}, txId = '', details = {}, zelle = {} } = body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const DEFAULT_ADMIN = process.env.ADMIN_EMAIL; // fallback admin email
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing RESEND_API_KEY' }), { status: 500 });
    }

    const send = async (to, subject, html) => {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Ngoc Anh Services <onboarding@resend.dev>',
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(`Resend error: ${r.status} ${r.statusText} ${JSON.stringify(data)}`);
      }
      return data;
    };

    const memoText = `Visa fee for application ${txId}`;
    const feeHtml = `
      <p><strong>Visa fee:</strong> $120</p>
      <p>Send via <strong>Zelle</strong> to <strong>Ngoc Anh Services</strong> at <strong>720-226-4972</strong>.</p>
      <p><strong>Memo to include:</strong> ${memoText}</p>
    `;

    const results = [];

    // --- Send to customer ---
    if (toCustomer && customer?.email) {
      const subject = `Your Visa Request – Transaction ID ${txId}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
          <h2>Thank you for your request</h2>
          <p>Transaction ID: <strong>${txId}</strong></p>
          ${feeHtml}
          <hr />
          <h3>Submitted details</h3>
          ${details?.idUrl ? `<p><strong>ID file:</strong> <a href="${details.idUrl}">${details.idUrl}</a></p>` : ''}
          <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;padding:12px;border-radius:8px;">${
            Object.entries(details || {}).map(([k,v]) => `${k}: ${v ?? ''}`).join('\n')
          }</pre>
        </div>
      `;
      try {
        const data = await send(customer.email, subject, html);
        results.push({ kind: 'customer', to: customer.email, id: data?.id || null, ok: true });
      } catch (err) {
        results.push({ kind: 'customer', to: customer.email, ok: false, error: String(err) });
      }
    }

    // --- Send to admin (with fallback) ---
    const adminTo = zelle?.adminEmail || DEFAULT_ADMIN;
    if (toAdmin && adminTo) {
      const subject = `New Visa Request – Transaction ID ${txId}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
          <h2>New Visa Request</h2>
          <p>Transaction ID: <strong>${txId}</strong></p>
          ${feeHtml}
          <hr />
          <h3>Submitted details</h3>
          ${details?.idUrl ? `<p><strong>ID file:</strong> <a href="${details.idUrl}">${details.idUrl}</a></p>` : ''}
          <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;padding:12px;border-radius:8px;">${
            Object.entries(details || {}).map(([k,v]) => `${k}: ${v ?? ''}`).join('\n')
          }</pre>
        </div>
      `;
      try {
        const data = await send(adminTo, subject, html);
        results.push({ kind: 'admin', to: adminTo, id: data?.id || null, ok: true });
      } catch (err) {
        results.push({ kind: 'admin', to: adminTo, ok: false, error: String(err) });
      }
    }

    // --- Final response ---
    const anyOk = results.some(r => r.ok);
    return new Response(JSON.stringify({ ok: anyOk, results }), { status: anyOk ? 200 : 500 });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};
