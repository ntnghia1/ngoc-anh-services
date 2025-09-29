// netlify/functions/send-email.js
export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405 });
    }

    const body = await req.json().catch(() => ({}));
    const { toCustomer, toAdmin, customer = {}, txId = '', details = {}, zelle = {} } = body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const DEFAULT_ADMIN = process.env.ADMIN_EMAIL; // set this in Netlify env
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing RESEND_API_KEY' }), { status: 500 });
    }

    // Determine form type (visa | send_money | passport)
    const formName = (details?.form || '').toString().trim().toLowerCase();
    const resolvedForm =
      formName.includes('passport') ? 'passport'
      : formName.includes('send') || formName.includes('transfer') ? 'send_money'
      : formName.includes('visa') ? 'visa'
      : 'visa';

    const subjects = {
      visa: {
        customer: `Your Visa Request – Transaction ID ${txId}`,
        admin:   `New Visa Request – Transaction ID ${txId}`,
      },
      send_money: {
        customer: `Your Transfer Request – Transaction ID ${txId}`,
        admin:   `New Transfer Request – Transaction ID ${txId}`,
      },
      passport: {
        customer: `Your VN Passport Renewal – Transaction ID ${txId}`,
        admin:   `New VN Passport Renewal – Transaction ID ${txId}`,
      },
    };

    const feeBlocks = {
      visa: `
        <p><strong>Visa fee:</strong> $120</p>
        <p>Send via <strong>Zelle</strong> to <strong>Ngoc Anh Services</strong> at <strong>720-226-4972</strong>.</p>
        <p><strong>Memo to include:</strong> Visa fee for application ${txId}</p>
      `,
      passport: `
        <p><strong>Passport Renewal fee:</strong> $230</p>
        <p>Send via <strong>Zelle</strong> to <strong>Ngoc Anh Services</strong> at <strong>720-226-4972</strong>.</p>
        <p><strong>Memo to include:</strong> VN Passport Renewal ${txId}</p>
      `,
      send_money: ``,
    };
    const feeHtml = feeBlocks[resolvedForm] || ``;

    const prettyDetails = (d) =>
      `<pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;padding:12px;border-radius:8px;">${
        Object.entries(d || {}).map(([k,v]) => `${k}: ${v ?? ''}`).join('\n')
      }</pre>`;

    const wrap = (title) => `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
        <h2>${title}</h2>
        <p>Transaction ID: <strong>${txId}</strong></p>
        ${feeHtml}
        <hr />
        <h3>Submitted details</h3>
        ${details?.idUrl ? `<p><strong>ID file:</strong> <a href="${details.idUrl}">${details.idUrl}</a></p>` : ''}
        ${prettyDetails(details)}
      </div>
    `;

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

    const results = [];

    // Customer (only if email present)
    if (toCustomer && customer?.email) {
      const subject = subjects[resolvedForm].customer;
      const title =
        resolvedForm === 'send_money' ? 'Thank you for your transfer request'
        : resolvedForm === 'passport' ? 'Thank you for your VN Passport Renewal request'
        : 'Thank you for your visa request';
      try {
        const data = await send(customer.email, subject, wrap(title));
        results.push({ kind: 'customer', to: customer.email, id: data?.id || null, ok: true });
      } catch (err) {
        results.push({ kind: 'customer', to: customer.email, ok: false, error: String(err) });
      }
    }

    // Admin (fallback to env ADMIN_EMAIL)
    const adminTo = zelle?.adminEmail || DEFAULT_ADMIN;
    if (toAdmin && adminTo) {
      const subject = subjects[resolvedForm].admin;
      const title =
        resolvedForm === 'send_money' ? 'New Transfer Request'
        : resolvedForm === 'passport' ? 'New VN Passport Renewal'
        : 'New Visa Request';
      try {
        const data = await send(adminTo, subject, wrap(title));
        results.push({ kind: 'admin', to: adminTo, id: data?.id || null, ok: true });
      } catch (err) {
        results.push({ kind: 'admin', to: adminTo, ok: false, error: String(err) });
      }
    }

    // If nobody was emailed, return 200 (don’t break the UI)
    const anyAttempted = results.length > 0;
    const anyOk = results.some(r => r.ok);
    const status = anyOk || !anyAttempted ? 200 : 500;
    return new Response(JSON.stringify({ ok: anyOk || !anyAttempted, results }), { status });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};
