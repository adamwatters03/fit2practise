/* Fit to Practise — shared catalog + cart/enrolment/progress state (localStorage-backed).
   Exposed as a global `window.F2P` so every page and the shared header can use it
   without a build step or module plumbing. */
(function () {
  'use strict';

  var COURSES = [
    {
      id: 'navigating', wpId: 5672,
      title: 'Navigating Your FtP Journey',
      price: 25, author: 'Adam Watters',
      avatar: 'assets/img/Nurse-Smiling-750x500.jpg',
      img: 'assets/img/Nurse-Smiling-750x500.jpg',
      category: 'NMC', level: 'All levels', sessions: 3, hours: 2, rating: 5.0, reviews: 58,
      blurb: 'This in-depth course explores the Nursing and Midwifery Council (NMC) Fitness to Practise (FtP) process and provides a clear roadmap for navigating each stage. Split into stages—from initial Screening to Monitoring and Compliance—the course guides healthcare professionals through ',
      outline: [
        { type: 'lesson', title: 'Introduction' },
        { type: 'lesson', title: 'Learning' },
        { type: 'topic', title: 'Course Content: Navigating the NMC FtP Process' },
        { type: 'quiz', title: 'Course Quiz: Navigating the NMC FtP Process' }
      ]
    },
    {
      id: 'conduct', wpId: 5195,
      title: 'Code of Conduct',
      price: 25, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Code-of-Conduct-750x500.jpg',
      category: 'NMC', level: 'All levels', sessions: 7, hours: 5, rating: 5.0, reviews: 27,
      blurb: 'This in-depth course explores the Nursing and Midwifery Council (NMC) Code of Conduct and how it applies to professional reflection and the Fitness to Practise process. Split into four focused modules — one for each principle of the Code — the course guides healthcare professional',
      outline: [
        { type: 'lesson', title: 'Introduction' },
        { type: 'lesson', title: 'Learning' },
        { type: 'topic', title: 'Module One: Professionalism and Trust' },
        { type: 'topic', title: 'Module 2: Practice Effectively' },
        { type: 'topic', title: 'Module 3: Preserve Safety' },
        { type: 'topic', title: 'Module 4: Prioritise People' },
        { type: 'lesson', title: 'Course Recap' },
        { type: 'quiz', title: 'Module One: Quiz on NMC\'s Guidance for Promoting Professionalism and Trust' },
        { type: 'quiz', title: 'Module Two: Quiz Practice Effectively' },
        { type: 'quiz', title: 'Module Three: Quiz Preserve Safety' },
        { type: 'quiz', title: 'Module Four: Quiz Prioritise People' },
        { type: 'quiz', title: 'Final Assessment: Code of Conduct (Your Code Your FtP)' }
      ]
    },
    {
      id: 'reflection', wpId: 4206,
      title: 'Reflection Writing for the Fitness to Practise Process',
      price: 15, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Reflection-Writing-1-750x500.jpg',
      category: 'Reflective Practice', level: 'All levels', sessions: 6, hours: 4, rating: 5.0, reviews: 42,
      blurb: 'This comprehensive course is designed to guide healthcare professionals through the crucial skill of reflective writing, specifically tailored for those undergoing the fitness to practise process in the UK. Participants will learn to articulate their experiences, actions, and lear',
      outline: [
        { type: 'lesson', title: 'Course Content' },
        { type: 'topic', title: 'Introduction to the Course' },
        { type: 'topic', title: 'Reflection Writing For FTP' },
        { type: 'topic', title: 'Understanding Models of Reflection' },
        { type: 'topic', title: 'Getting the context of reflection' },
        { type: 'lesson', title: 'Course Recap' },
        { type: 'quiz', title: 'Quiz: Reflection Writing for FTP' },
        { type: 'quiz', title: 'Quiz: Understanding Models of Reflection' },
        { type: 'quiz', title: 'Quiz: Getting the context of reflection' },
        { type: 'quiz', title: 'Reflection Writing Final Quiz' }
      ]
    },
    {
      id: 'rebuilding', wpId: 4291,
      title: 'Rebuilding Confidence Following Fitness to Practise',
      price: 25, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Rebuilding-Confidence-750x500.jpg',
      category: 'Confidence', level: 'All levels', sessions: 7, hours: 5, rating: 5.0, reviews: 31,
      blurb: 'This transformative three-part module is designed to support healthcare professionals in rebuilding their confidence after going through the fitness to practise process. The course focuses on understanding the emotional impact of the process, developing strategies for personal and',
      outline: [
        { type: 'lesson', title: 'Introduction' },
        { type: 'lesson', title: 'Learning' },
        { type: 'topic', title: 'Exploring Challenges' },
        { type: 'topic', title: 'Ready to return to work?' },
        { type: 'topic', title: 'Interviews and Disclosure' },
        { type: 'topic', title: 'Invisible impact of FtP' },
        { type: 'lesson', title: 'Course Recap' },
        { type: 'quiz', title: 'Module One: Quiz' },
        { type: 'quiz', title: 'Module Two: Quiz' },
        { type: 'quiz', title: 'Module Three: Quiz' },
        { type: 'quiz', title: 'Module Four: Quiz' },
        { type: 'quiz', title: 'Final Assessment: Rebuilding Confidence following FtP' }
      ]
    },
    {
      id: 'hearing', wpId: 5053,
      title: 'Attending a Fitness to Practice Hearing – what to expect',
      price: 10, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Healthcare-professional-on-laptop-750x500.jpg',
      category: 'Hearings', level: 'All levels', sessions: 2, hours: 1, rating: 5.0, reviews: 19,
      blurb: 'This practical, single-module course is designed to guide healthcare professionals through the process of attending a Fitness to Practise (FtP) hearing. Whether you are currently facing a hearing or supporting someone who is, the course outlines what to expect on the day, who will',
      outline: [
        { type: 'lesson', title: 'Course Content' },
        { type: 'topic', title: 'Content' },
        { type: 'quiz', title: 'Final Assessment: Attending a Fitness to Practice Hearing – what to expect' }
      ]
    },
    {
      id: 'dishonesty', wpId: 4525,
      title: 'Dishonesty Explored',
      price: 25, author: 'Cathryn Watters',
      avatar: 'assets/img/cathryn.jpg',
      img: 'assets/img/Facing-Challenges.jpg',
      category: 'Professional Conduct', level: 'All levels', sessions: 4, hours: 3, rating: 5.0, reviews: 23,
      blurb: 'Dishonesty Explored is a focused course designed to help healthcare professionals understand the impact, context, and regulatory expectations around dishonesty in Fitness to Practise (FtP) cases. Whether you\'ve faced concerns about dishonesty yourself or want to better understand ',
      outline: [
        { type: 'lesson', title: 'Course Content' },
        { type: 'topic', title: 'What is dishonesty and why do regulators take it seriously?' },
        { type: 'topic', title: 'Legal aspects around dishonesty charges' },
        { type: 'topic', title: 'Defending a Dishonesty Charge' },
        { type: 'quiz', title: 'What is dishonesty and why do regulators take it seriously?' },
        { type: 'quiz', title: 'Quiz: Legal aspects around dishonesty charges' },
        { type: 'quiz', title: 'Quiz: Defending a Dishonesty Charge' },
        { type: 'quiz', title: 'Dishonesty Module Quiz' }
      ]
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
