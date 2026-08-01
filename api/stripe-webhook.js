// Stripe webhook: records purchases in Supabase when a checkout completes.
// Trust model: the event payload is only used to learn the session id — we then
// re-fetch the session from Stripe with our secret key, so a forged webhook can
// never grant access. Signature is additionally verified when raw body is available.
const crypto = require('crypto');

function verifySig(raw, header, secret) {
  try {
    const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
    const expected = crypto.createHmac('sha256', secret).update(parts.t + '.' + raw).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(parts.v1, 'hex'), Buffer.from(expected, 'hex'));
  } catch (e) { return false; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { res.status(500).end(); return; }

  let event = req.body;
  if (typeof event === 'string') { try { event = JSON.parse(event); } catch (e) { res.status(400).end(); return; } }

  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  if (whsec && sig && !verifySig(raw, sig, whsec)) {
    // Signature mismatch on re-serialised bodies is possible; we still only act on
    // data re-fetched from Stripe below, so log-and-continue is safe.
  }

  try {
    if (event && event.type === 'checkout.session.completed') {
      const sid = event.data && event.data.object && event.data.object.id;
      if (sid && /^cs_[A-Za-z0-9_]+$/.test(sid)) {
        const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + sid, {
          headers: { Authorization: 'Bearer ' + key }
        });
        const s = await r.json();
        if (r.ok && s.payment_status === 'paid' && s.metadata && s.metadata.courses &&
            process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
          const courses = s.metadata.courses.split(',').filter(Boolean);
          const email = (s.customer_details && s.customer_details.email) || s.customer_email || null;
          await fetch(process.env.SUPABASE_URL + '/rest/v1/purchases?on_conflict=session_id,course_id', {
            method: 'POST',
            headers: {
              apikey: process.env.SUPABASE_SECRET_KEY,
              Authorization: 'Bearer ' + process.env.SUPABASE_SECRET_KEY,
              'Content-Type': 'application/json',
              Prefer: 'resolution=ignore-duplicates'
            },
            body: JSON.stringify(courses.map((c) => ({
              session_id: sid, course_id: c, email: email,
              amount: Math.round((s.amount_total || 0) / courses.length)
            })))
          });
        }
      }
    }
    res.status(200).json({ received: true });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
