/* Fit to Practise — shared catalog + cart/enrolment/progress state (localStorage-backed).
   Exposed as a global `window.F2P` so every page and the shared header can use it
   without a build step or module plumbing. */
(function () {
  'use strict';

  var COURSES = [
    {
      id: 'reflection', slug: 'reflection-writing-for-ftp',
      title: 'Reflection Writing for the Fitness to Practise Process',
      price: 15, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Reflection-Writing-1-750x500.jpg',
      category: 'Reflective Practice', level: 'All levels', sessions: 5, hours: 3, rating: 5.0, reviews: 42,
      blurb: 'Guide healthcare professionals through the crucial skill of reflective writing, tailored for those undergoing the fitness to practise process in the UK.'
    },
    {
      id: 'rebuilding', slug: 'rebuilding-confidence-following-fitness-to-practise',
      title: 'Rebuilding Confidence Following Fitness to Practise',
      price: 25, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Rebuilding-Confidence-750x500.jpg',
      category: 'Confidence', level: 'All levels', sessions: 3, hours: 2, rating: 5.0, reviews: 31,
      blurb: 'A transformative three-part module designed to support healthcare professionals in rebuilding their confidence after the fitness to practise process.'
    },
    {
      id: 'navigating', slug: 'navigating-the-nmc-fitness-to-practise',
      title: 'Navigating Your FtP Journey',
      price: 25, author: 'Adam Watters',
      avatar: 'assets/img/Nurse-Smiling-750x500.jpg',
      img: 'assets/img/Nurse-Smiling-750x500.jpg',
      category: 'NMC', level: 'Beginner', sessions: 6, hours: 4, rating: 5.0, reviews: 58,
      blurb: 'An in-depth course exploring the Nursing and Midwifery Council (NMC) Fitness to Practise (FtP) process from first contact to final outcome.'
    },
    {
      id: 'conduct', slug: 'code-of-conduct',
      title: 'Code of Conduct',
      price: 25, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Code-of-Conduct-750x500.jpg',
      category: 'NMC', level: 'All levels', sessions: 5, hours: 3, rating: 5.0, reviews: 27,
      blurb: 'An in-depth course exploring the Nursing and Midwifery Council (NMC) Code of Conduct and how it applies to your everyday practice.'
    },
    {
      id: 'hearing', slug: 'attending-a-fitness-to-practice-hearing-what-to-expect',
      title: 'Attending a Fitness to Practice Hearing – what to expect',
      price: 10, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Healthcare-professional-on-laptop-750x500.jpg',
      category: 'Hearings', level: 'All levels', sessions: 1, hours: 1, rating: 5.0, reviews: 19,
      blurb: 'A practical, single-module course guiding healthcare professionals through exactly what to expect when attending a fitness to practise hearing.'
    }
  ];

  var CART_KEY = 'f2p_cart';
  var ENROLL_KEY = 'f2p_enrolled';
  var PROGRESS_KEY = 'f2p_progress';

  function read(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } }
  function readObj(key) { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; } }
  function notify() { try { window.dispatchEvent(new Event('f2p-change')); } catch (e) {} }

  function courseById(id) { for (var i = 0; i < COURSES.length; i++) { if (COURSES[i].id === id) return COURSES[i]; } return null; }

  function getCart() { return read(CART_KEY); }
  function cartCount() { return getCart().length; }
  function inCart(id) { return getCart().indexOf(id) > -1; }
  function setCart(ids) { localStorage.setItem(CART_KEY, JSON.stringify(ids)); notify(); }
  function addToCart(id) { var c = getCart(); if (c.indexOf(id) < 0) { c.push(id); setCart(c); } }
  function removeFromCart(id) { setCart(getCart().filter(function (x) { return x !== id; })); }
  function cartTotal() { return getCart().reduce(function (s, id) { var c = courseById(id); return s + (c ? c.price : 0); }, 0); }

  function getEnrolled() { return read(ENROLL_KEY); }
  function isEnrolled(id) { return getEnrolled().indexOf(id) > -1; }
  function enrollCart() {
    var set = {}; getEnrolled().forEach(function (id) { set[id] = 1; });
    var prog = readObj(PROGRESS_KEY);
    getCart().forEach(function (id) { set[id] = 1; if (prog[id] == null) prog[id] = 0; });
    localStorage.setItem(ENROLL_KEY, JSON.stringify(Object.keys(set)));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
    setCart([]);
  }
  function enroll(id) {
    var set = {}; getEnrolled().forEach(function (x) { set[x] = 1; }); set[id] = 1;
    var prog = readObj(PROGRESS_KEY); if (prog[id] == null) prog[id] = 0;
    localStorage.setItem(ENROLL_KEY, JSON.stringify(Object.keys(set)));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
    notify();
  }
  function getProgress() { return readObj(PROGRESS_KEY); }
  function setProgress(id, pct) {
    var prog = readObj(PROGRESS_KEY); prog[id] = Math.max(0, Math.min(100, pct));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog)); notify();
  }

  // ----- demo accounts (front-end only) -----
  // Learner with every course unlocked:
  var ALL_ACCESS_EMAILS = ['member@fit2practise.com'];
  // Admin / business owner — sees analytics + members in the portal:
  var ADMIN_EMAILS = ['admin@fit2practise.com'];

  function enrollAll() { COURSES.forEach(function (c) { enroll(c.id); }); }
  function grantIfAllAccess(email) {
    if (email && ALL_ACCESS_EMAILS.indexOf(String(email).trim().toLowerCase()) > -1) { enrollAll(); return true; }
    return false;
  }
  function isAdmin(email) {
    return !!email && ADMIN_EMAILS.indexOf(String(email).trim().toLowerCase()) > -1;
  }

  window.F2P = {
    COURSES: COURSES, courseById: courseById,
    getCart: getCart, cartCount: cartCount, inCart: inCart, setCart: setCart,
    addToCart: addToCart, removeFromCart: removeFromCart, cartTotal: cartTotal,
    getEnrolled: getEnrolled, isEnrolled: isEnrolled, enrollCart: enrollCart, enroll: enroll,
    enrollAll: enrollAll, grantIfAllAccess: grantIfAllAccess, ALL_ACCESS_EMAILS: ALL_ACCESS_EMAILS,
    isAdmin: isAdmin, ADMIN_EMAILS: ADMIN_EMAILS,
    getProgress: getProgress, setProgress: setProgress
  };
})();
