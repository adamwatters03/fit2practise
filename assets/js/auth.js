/* Fit to Practise — real accounts via Supabase Auth.
   The URL and publishable key are public by design (safe to ship to browsers);
   all data access is enforced server-side by Row Level Security. */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://wyurumxtbiaeywtbtaej.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_wHcLTKciDU-4CCr678niQw_W7lZYjpc';

  var client = null;
  function sb() {
    if (!client && window.supabase && window.supabase.createClient) {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return client;
  }

  async function session() {
    var c = sb(); if (!c) return null;
    var r = await c.auth.getSession();
    return (r.data && r.data.session) || null;
  }

  async function signUp(email, password, name) {
    var c = sb(); if (!c) throw new Error('Auth unavailable');
    var r = await c.auth.signUp({ email: email, password: password, options: { data: { name: name || '' } } });
    if (r.error) throw r.error;
    return r.data;
  }

  async function signIn(email, password) {
    var c = sb(); if (!c) throw new Error('Auth unavailable');
    var r = await c.auth.signInWithPassword({ email: email, password: password });
    if (r.error) throw r.error;
    return r.data;
  }

  async function signOut() {
    var c = sb(); if (!c) return;
    await c.auth.signOut();
    try { localStorage.removeItem('f2p_user'); } catch (e) {}
    try { window.dispatchEvent(new Event('f2p-change')); } catch (e) {}
  }

  // Pull my purchases from the database (RLS: only rows matching my verified
  // email) and mirror them into the local enrolment state the UI already uses.
  async function syncPurchases() {
    var c = sb(); var s = await session();
    if (!c || !s) return [];
    var r = await c.from('purchases').select('course_id');
    if (r.error) return [];
    var ids = (r.data || []).map(function (x) { return x.course_id; });
    if (window.F2P) ids.forEach(function (id) { window.F2P.enroll(id); });
    return ids;
  }

  // Load gated course content — succeeds only if RLS says I bought it.
  async function getContent(courseId) {
    var c = sb(); if (!c) return null;
    var r = await c.from('course_content').select('data').eq('course_id', courseId).maybeSingle();
    if (r.error || !r.data) return null;
    return r.data.data;
  }

  async function saveProgress(courseId, pct) {
    var c = sb(); var s = await session();
    if (!c || !s) return;
    await c.from('progress').upsert({ user_id: s.user.id, course_id: courseId, pct: pct, updated_at: new Date().toISOString() });
  }

  async function loadProgress() {
    var c = sb(); var s = await session();
    if (!c || !s) return {};
    var r = await c.from('progress').select('course_id,pct');
    var out = {};
    (r.data || []).forEach(function (x) { out[x.course_id] = x.pct; });
    return out;
  }

  // Reflect login state into the local identity the site header/pages use.
  async function hydrate() {
    var s = await session();
    if (s && s.user) {
      var name = (s.user.user_metadata && s.user.user_metadata.name) || (s.user.email || '').split('@')[0];
      try { localStorage.setItem('f2p_user', JSON.stringify({ name: name, email: s.user.email })); } catch (e) {}
      await syncPurchases();
      try { window.dispatchEvent(new Event('f2p-change')); } catch (e) {}
    }
    return s;
  }

  window.F2PAuth = {
    sb: sb, session: session, signUp: signUp, signIn: signIn, signOut: signOut,
    syncPurchases: syncPurchases, getContent: getContent,
    saveProgress: saveProgress, loadProgress: loadProgress, hydrate: hydrate
  };
})();
