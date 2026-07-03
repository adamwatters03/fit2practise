// Shared catalog + cart/enrollment state for Fit to Practise (localStorage-backed)

export const COURSES = [
  {
    id: 'reflection', slug: 'reflection-writing-for-ftp',
    title: 'Reflection Writing for the Fitness to Practise Process',
    price: 15, author: 'Cathryn Watters',
    avatar: 'https://secure.gravatar.com/avatar/f2751a284394e7a922fa52c1c575be655d9094359323268157a3416186762053?s=80&d=mm&r=g',
    img: 'https://fit2practise.com/wp-content/uploads/2025/04/Reflection-Writing-1-750x500.jpg',
    category: 'Reflective Practice', level: 'All levels', sessions: 5, hours: 3, rating: 5.0, reviews: 42,
    blurb: 'Guide healthcare professionals through the crucial skill of reflective writing, tailored for those undergoing the fitness to practise process in the UK.'
  },
  {
    id: 'rebuilding', slug: 'rebuilding-confidence-following-fitness-to-practise',
    title: 'Rebuilding Confidence Following Fitness to Practise',
    price: 25, author: 'Cathryn Watters',
    avatar: 'https://secure.gravatar.com/avatar/f2751a284394e7a922fa52c1c575be655d9094359323268157a3416186762053?s=80&d=mm&r=g',
    img: 'https://fit2practise.com/wp-content/uploads/2025/04/Rebuilding-Confidence-750x500.jpg',
    category: 'Confidence', level: 'All levels', sessions: 3, hours: 2, rating: 5.0, reviews: 31,
    blurb: 'A transformative three-part module designed to support healthcare professionals in rebuilding their confidence after the fitness to practise process.'
  },
  {
    id: 'navigating', slug: 'navigating-the-nmc-fitness-to-practise',
    title: 'Navigating Your FtP Journey',
    price: 25, author: 'Adam Watters',
    avatar: 'https://secure.gravatar.com/avatar/e0596093fee00ed2385fc78ed41e12e01288a3131233361dba9a3e1b3139e2f5?s=80&d=mm&r=g',
    img: 'https://fit2practise.com/wp-content/uploads/2026/03/Nurse-Smiling-750x500.jpg',
    category: 'NMC', level: 'Beginner', sessions: 6, hours: 4, rating: 5.0, reviews: 58,
    blurb: 'An in-depth course exploring the Nursing and Midwifery Council (NMC) Fitness to Practise (FtP) process from first contact to final outcome.'
  },
  {
    id: 'conduct', slug: 'code-of-conduct',
    title: 'Code of Conduct',
    price: 25, author: 'Cathryn Watters',
    avatar: 'https://secure.gravatar.com/avatar/f2751a284394e7a922fa52c1c575be655d9094359323268157a3416186762053?s=80&d=mm&r=g',
    img: 'https://fit2practise.com/wp-content/uploads/2025/07/Code-of-Conduct-750x500.jpg',
    category: 'NMC', level: 'All levels', sessions: 5, hours: 3, rating: 5.0, reviews: 27,
    blurb: 'An in-depth course exploring the Nursing and Midwifery Council (NMC) Code of Conduct and how it applies to your everyday practice.'
  },
  {
    id: 'hearing', slug: 'attending-a-fitness-to-practice-hearing-what-to-expect',
    title: 'Attending a Fitness to Practice Hearing – what to expect',
    price: 10, author: 'Cathryn Watters',
    avatar: 'https://secure.gravatar.com/avatar/f2751a284394e7a922fa52c1c575be655d9094359323268157a3416186762053?s=80&d=mm&r=g',
    img: 'https://fit2practise.com/wp-content/uploads/2025/06/Healthcare-professional-on-laptop-750x500.jpg',
    category: 'Hearings', level: 'All levels', sessions: 1, hours: 1, rating: 5.0, reviews: 19,
    blurb: 'A practical, single-module course guiding healthcare professionals through exactly what to expect when attending a fitness to practise hearing.'
  }
];

const CART_KEY = 'f2p_cart';
const ENROLL_KEY = 'f2p_enrolled';
const PROGRESS_KEY = 'f2p_progress';

function read(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } }
function readObj(key) { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; } }

export function courseById(id) { return COURSES.find(c => c.id === id); }

export function getCart() { return read(CART_KEY); }
export function cartCount() { return getCart().length; }
export function inCart(id) { return getCart().includes(id); }
export function setCart(ids) { localStorage.setItem(CART_KEY, JSON.stringify(ids)); notify(); }
export function addToCart(id) { const c = getCart(); if (!c.includes(id)) { c.push(id); setCart(c); } }
export function removeFromCart(id) { setCart(getCart().filter(x => x !== id)); }
export function cartTotal() { return getCart().reduce((s, id) => s + (courseById(id)?.price || 0), 0); }

export function getEnrolled() { return read(ENROLL_KEY); }
export function isEnrolled(id) { return getEnrolled().includes(id); }
export function enrollCart() {
  const set = new Set(getEnrolled());
  const prog = readObj(PROGRESS_KEY);
  getCart().forEach(id => { set.add(id); if (prog[id] == null) prog[id] = 0; });
  localStorage.setItem(ENROLL_KEY, JSON.stringify([...set]));
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
  setCart([]);
}
export function enroll(id) {
  const set = new Set(getEnrolled()); set.add(id);
  const prog = readObj(PROGRESS_KEY); if (prog[id] == null) prog[id] = 0;
  localStorage.setItem(ENROLL_KEY, JSON.stringify([...set]));
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
  notify();
}
export function getProgress() { return readObj(PROGRESS_KEY); }
export function setProgress(id, pct) {
  const prog = readObj(PROGRESS_KEY); prog[id] = Math.max(0, Math.min(100, pct));
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog)); notify();
}

function notify() { try { window.dispatchEvent(new Event('f2p-change')); } catch (e) {} }
