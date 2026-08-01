// Creates a Stripe Checkout Session for the cart. Zero-dependency (uses fetch).
// POST { items: ['navigating', ...], email?: 'x@y.com' } -> { url }
const CATALOG = require('./_catalog.js');

async function stripe(path, params, key) {
  const body = new URLSearchParams(params).toString();
  const r = await fetch('https://api.stripe.com/v1/' + path, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || ('Stripe error ' + r.status));
  return j;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { res.status(500).json({ error: 'Payments not configured' }); return; }
  try {
    const { items, email } = req.body || {};
    const ids = (Array.isArray(items) ? items : []).filter((id) => CATALOG[id]);
    if (!ids.length) { res.status(400).json({ error: 'Cart is empty' }); return; }

    const site = process.env.SITE_URL || ('https://' + (req.headers['x-forwarded-host'] || req.headers.host));
    const params = {
      mode: 'payment',
      success_url: site + '/my-courses.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: site + '/cart.html',
      'metadata[courses]': ids.join(','),
      allow_promotion_codes: 'false',
      // Account has Managed Payments on by default; opt out per-session so
      // standard processing applies (no product tax codes required).
      'managed_payments[enabled]': 'false'
    };
    if (email) params.customer_email = email;
    ids.forEach((id, i) => {
      params['line_items[' + i + '][quantity]'] = '1';
      params['line_items[' + i + '][price_data][currency]'] = 'gbp';
      params['line_items[' + i + '][price_data][unit_amount]'] = String(CATALOG[id].amount);
      params['line_items[' + i + '][price_data][product_data][name]'] = CATALOG[id].name;
    });
    // Member discount: 20% off when buying 2+ courses (mirrors the cart UI).
    if (ids.length >= 2) {
      const coupon = await stripe('coupons', { percent_off: '20', duration: 'once', name: 'Member discount' }, key);
      params['discounts[0][coupon]'] = coupon.id;
    }
    const session = await stripe('checkout/sessions', params, key);
    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
