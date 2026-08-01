// One-shot infrastructure setup, run by GitHub Actions (see .github/workflows/infra.yml).
// - Ensures the Vercel project exists and is linked to this repo
// - Sets the environment variables the serverless functions need
// - Creates the Stripe webhook endpoint and stores its signing secret
// - Triggers a production deployment
// Secrets come from GitHub Actions secrets; nothing sensitive is in the repo.

const VT = process.env.VERCEL_TOKEN;
const SK = process.env.STRIPE_SECRET_KEY;
const SUPA_URL = process.env.SUPABASE_URL || '';
const SUPA_SECRET = process.env.SUPABASE_SECRET_KEY || '';
const REPO = 'adamwatters03/fit2practise';
const PROJECT = 'fit2practise';

if (!VT || !SK) { console.error('Missing VERCEL_TOKEN or STRIPE_SECRET_KEY'); process.exit(1); }

async function vercel(path, opts = {}) {
  const r = await fetch('https://api.vercel.com' + path, {
    ...opts,
    headers: { Authorization: 'Bearer ' + VT, 'Content-Type': 'application/json', ...(opts.headers || {}) }
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j };
}
async function stripe(path, params) {
  const opts = { headers: { Authorization: 'Bearer ' + SK } };
  if (params) {
    opts.method = 'POST';
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    opts.body = new URLSearchParams(params).toString();
  }
  const r = await fetch('https://api.stripe.com/v1/' + path, opts);
  const j = await r.json();
  if (!r.ok) throw new Error('Stripe ' + path + ': ' + ((j.error && j.error.message) || r.status));
  return j;
}

// 1. Ensure project
let p = await vercel(`/v9/projects/${PROJECT}`);
if (p.status === 404) {
  console.log('Creating Vercel project linked to', REPO);
  p = await vercel('/v10/projects', {
    method: 'POST',
    body: JSON.stringify({ name: PROJECT, gitRepository: { type: 'github', repo: REPO } })
  });
  if (!p.ok) { console.error('Could not create project:', JSON.stringify(p.j)); console.error('If this mentions the GitHub integration, import the repo once at vercel.com/new'); process.exit(1); }
} else if (!p.ok) { console.error('Vercel error', p.status, JSON.stringify(p.j)); process.exit(1); }
const project = p.j;
console.log('Project:', project.id, project.name);

// 2. Site URL from project domains
const doms = await vercel(`/v9/projects/${project.id}/domains`);
const domain = ((doms.j.domains || []).find(d => d.verified) || (doms.j.domains || [])[0] || {}).name || `${PROJECT}.vercel.app`;
const SITE_URL = 'https://' + domain;
console.log('Site URL:', SITE_URL);

// 3. Stripe webhook endpoint (idempotent)
const hookUrl = SITE_URL + '/api/stripe-webhook';
const hooks = await stripe('webhook_endpoints?limit=100');
let hook = (hooks.data || []).find(h => h.url === hookUrl);
if (!hook) {
  hook = await stripe('webhook_endpoints', { url: hookUrl, 'enabled_events[0]': 'checkout.session.completed', description: 'Fit to Practise site' });
  console.log('Created webhook:', hook.id, '(secret captured)');
} else {
  console.log('Webhook already exists:', hook.id);
}

// 4. Env vars (upsert)
const wanted = {
  STRIPE_SECRET_KEY: SK,
  SITE_URL,
  ...(hook.secret ? { STRIPE_WEBHOOK_SECRET: hook.secret } : {}),
  ...(SUPA_URL ? { SUPABASE_URL: SUPA_URL } : {}),
  ...(SUPA_SECRET ? { SUPABASE_SECRET_KEY: SUPA_SECRET } : {})
};
const existing = await vercel(`/v9/projects/${project.id}/env`);
const byKey = {}; (existing.j.envs || []).forEach(e => { byKey[e.key] = e; });
for (const [key, value] of Object.entries(wanted)) {
  if (byKey[key]) await vercel(`/v9/projects/${project.id}/env/${byKey[key].id}`, { method: 'PATCH', body: JSON.stringify({ value }) });
  else await vercel(`/v10/projects/${project.id}/env`, { method: 'POST', body: JSON.stringify({ key, value, type: 'encrypted', target: ['production', 'preview'] }) });
  console.log('env set:', key);
}

// 5. Trigger production deployment from main
const repoId = project.link && project.link.repoId;
if (repoId) {
  const d = await vercel('/v13/deployments', {
    method: 'POST',
    body: JSON.stringify({ name: PROJECT, project: project.id, target: 'production', gitSource: { type: 'github', repoId, ref: 'main' } })
  });
  console.log('Deployment triggered:', d.ok ? (d.j.url || d.j.id) : JSON.stringify(d.j));
} else {
  console.log('No repo link found — push to main to deploy.');
}
console.log('DONE. Site:', SITE_URL);
