// Verifies a completed Checkout Session server-side and returns the purchased courses.
// GET ?session_id=cs_... -> { paid: true, courses: ['navigating'], email }
// Also records the purchase in Supabase when configured (idempotent on session id).
module.exports = async (req, res) => {
  const key = process.env.STRIPE_SECRET_KEY;
  const sid = (req.query && req.query.session_id) || '';
  if (!key || !/^cs_[A-Za-z0-9_]+$/.test(sid)) { res.status(400).json({ error: 'Bad request' }); return; }
  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + sid, {
      headers: { Authorization: 'Bearer ' + key }
    });
    const s = await r.json();
    if (!r.ok) { res.status(400).json({ error: (s.error && s.error.message) || 'Stripe error' }); return; }
    const paid = s.payment_status === 'paid';
    const courses = paid && s.metadata && s.metadata.courses ? s.metadata.courses.split(',').filter(Boolean) : [];
    const email = (s.customer_details && s.customer_details.email) || s.customer_email || null;

    if (paid && courses.length && process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
      try {
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
      } catch (e) { /* recorded by webhook as well; never block the user */ }
    }
    res.status(200).json({ paid, courses, email });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
