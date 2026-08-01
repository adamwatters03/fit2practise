// Creates (or finds) a Supabase auth user and grants course access by inserting
// purchase records. Run via GitHub Actions. Used for test accounts and for
// migrating past customers.
// env: SUPABASE_URL, SUPABASE_SECRET_KEY, GRANT_EMAIL, GRANT_PASSWORD (optional
// for existing users), GRANT_COURSES (csv or "all")

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;
const EMAIL = (process.env.GRANT_EMAIL || '').trim().toLowerCase();
const PASSWORD = process.env.GRANT_PASSWORD || '';
const COURSES = (process.env.GRANT_COURSES || 'all').trim();
const ALL = ['navigating', 'conduct', 'reflection', 'rebuilding', 'hearing', 'dishonesty'];

if (!URL_ || !KEY || !EMAIL) { console.error('missing SUPABASE_URL / SUPABASE_SECRET_KEY / GRANT_EMAIL'); process.exit(1); }

const H = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };

async function api(path, opts = {}) {
  const r = await fetch(URL_ + path, { ...opts, headers: { ...H, ...(opts.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j };
}

// 1. Create the user (pre-confirmed) or find the existing one
let userId = null;
if (PASSWORD) {
  const c = await api('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, email_confirm: true, user_metadata: { name: 'Test Member' } })
  });
  if (c.ok) { userId = c.j.id; console.log('user created:', EMAIL); }
  else if (c.status === 422 || /already/i.test(JSON.stringify(c.j))) console.log('user already exists:', EMAIL);
  else { console.error('create user failed:', c.status, JSON.stringify(c.j).slice(0, 300)); process.exit(1); }
}
if (!userId) {
  const q = await api('/auth/v1/admin/users?page=1&per_page=200');
  const u = ((q.j && q.j.users) || []).find(x => (x.email || '').toLowerCase() === EMAIL);
  if (u) { userId = u.id; console.log('found user:', EMAIL); }
}

// 2. Grant purchases
const ids = COURSES === 'all' ? ALL : COURSES.split(',').map(s => s.trim()).filter(s => ALL.includes(s));
const rows = ids.map(c => ({ session_id: 'manual-grant-' + EMAIL, course_id: c, email: EMAIL, amount: 0 }));
const ins = await api('/rest/v1/purchases?on_conflict=session_id,course_id', {
  method: 'POST',
  headers: { Prefer: 'resolution=ignore-duplicates' },
  body: JSON.stringify(rows)
});
console.log('purchases insert:', ins.status, 'granted courses:', ids.join(', '));

// 3. Verify
const chk = await api('/rest/v1/purchases?email=eq.' + encodeURIComponent(EMAIL) + '&select=course_id');
console.log('verified rows for', EMAIL, '->', (chk.j || []).map(r => r.course_id).join(', '));
console.log('DONE');
