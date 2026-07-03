/* Fit to Practise — shared site runtime.
   Injects the header/footer/decorative shapes, and drives the progressive
   animations (scroll-reveal, parallax, sticky-shrink header) + cart badge.
   Loaded (non-deferred) in <head> so the reveal class is set before first paint. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Set the reveal state before the body paints to avoid a flash of visible-then-hidden content.
  if (!reduceMotion) document.documentElement.classList.add('reveal-on');

  var LOGO_LIGHT = 'assets/img/F2P-logo-09-2.png'; // header (cream bg)
  var LOGO_DARK  = 'assets/img/F2P-logo-08-2.png'; // footer (dark bg)

  var NAV = [
    ['index.html', 'Home', 'home'],
    ['courses.html', 'Courses', 'courses'],
    ['mentorship.html', 'Mentorship', 'mentorship'],
    ['about.html', 'About', 'about'],
    ['faqs.html', 'FAQs', 'faqs'],
    ['articles.html', 'Articles', 'articles'],
    ['contact.html', 'Contact', 'contact']
  ];

  function currentPage() {
    var f = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (!f) f = 'index.html';
    var map = {
      'index.html': 'home', '': 'home',
      'courses.html': 'courses', 'course.html': 'courses',
      'my-courses.html': 'mycourses', 'cart.html': 'cart',
      'about.html': 'about', 'faqs.html': 'faqs', 'articles.html': 'articles',
      'contact.html': 'contact', 'profile.html': 'profile', 'login.html': 'login',
      'portal.html': 'portal'
    };
    return map[f] || 'home';
  }

  function headerHTML(active) {
    var links = NAV.map(function (n) {
      var cls = 'shx-udl' + (n[2] === active ? ' active' : '');
      return '<a class="' + cls + '" href="' + n[0] + '">' + n[1] + '</a>';
    }).join('');
    var mobile = NAV.concat([['my-courses.html', 'My Courses', 'mycourses'], ['portal.html', 'Login / Register', 'portal']]).map(function (n) {
      return '<a href="' + n[0] + '">' + n[1] + '</a>';
    }).join('');
    return '' +
      '<div class="shx">' +
        '<div class="shx-inner">' +
          '<a href="index.html" style="flex-shrink:0;display:flex;align-items:center;"><img src="' + LOGO_LIGHT + '" alt="Fit to Practise" style="height:42px;width:auto;display:block;"></a>' +
          '<nav class="shx-nav">' + links + '</nav>' +
          '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">' +
            '<a href="cart.html" class="shx-lift" style="position:relative;width:44px;height:44px;border-radius:12px;border:1px solid #E3DCCD;background:#fff;color:#271640;display:flex;align-items:center;justify-content:center;" aria-label="Cart">' +
              window.F2PIcon('cart', { size: 20 }) +
              '<span id="shx-cart-badge" style="display:none;position:absolute;top:-7px;right:-7px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#1C8A5E;color:#fff;font-size:11px;font-weight:700;align-items:center;justify-content:center;">0</span>' +
            '</a>' +
            '<a href="portal.html" class="shx-hidem" style="display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:14.5px;color:#3A2F4A;"><span style="width:28px;height:28px;border-radius:50%;background:#E7F2EC;color:#15724C;display:flex;align-items:center;justify-content:center;">' + window.F2PIcon('user', { size: 15 }) + '</span>Log in</a>' +
            '<a href="courses.html" class="shx-lift shx-hidem" style="background:#1C8A5E;color:#fff;font-weight:600;font-size:14.5px;padding:11px 20px;border-radius:999px;box-shadow:0 8px 20px rgba(28,138,94,0.28);">Browse Courses</a>' +
            '<button class="shx-burger" id="shx-burger" aria-label="Menu"><span></span><span></span><span></span></button>' +
          '</div>' +
        '</div>' +
        '<div class="shx-mobile" id="shx-mobile" style="display:none;"><div class="shx-mobile-inner">' + mobile + '</div></div>' +
      '</div>';
  }

  function footerHTML() {
    return '' +
      '<footer class="sfx"><div class="sfx-inner">' +
        '<div class="sfx-grid">' +
          '<div><img src="' + LOGO_DARK + '" alt="Fit to Practise" style="height:44px;width:auto;margin-bottom:14px;"><p style="font-size:14.5px;line-height:1.6;color:#A79EB5;max-width:300px;margin:0;">We are passionate about helping healthcare professionals regain and maintain their Fitness to Practise.</p></div>' +
          '<div><h4>Explore</h4><div class="sfx-col">' +
            '<a class="sfx-udl" href="index.html">Home</a><a class="sfx-udl" href="courses.html">Courses</a><a class="sfx-udl" href="mentorship.html">Mentorship</a><a class="sfx-udl" href="about.html">About</a><a class="sfx-udl" href="articles.html">Articles</a>' +
          '</div></div>' +
          '<div><h4>Account</h4><div class="sfx-col">' +
            '<a class="sfx-udl" href="portal.html">Login / Register</a><a class="sfx-udl" href="my-courses.html">My Courses</a><a class="sfx-udl" href="profile.html">Profile</a><a class="sfx-udl" href="cart.html">Cart</a>' +
          '</div></div>' +
          '<div><h4>Get in touch</h4><div class="sfx-col"><a class="sfx-udl" href="contact.html">Contact</a><a class="sfx-udl" href="faqs.html">FAQs</a><a class="sfx-udl" href="mailto:hello@fit2practise.com">hello@fit2practise.com</a></div></div>' +
        '</div>' +
        '<div class="sfx-bottom"><span>Copyright — Fit to Practise — All Rights Reserved</span>' +
          '<div style="display:flex;gap:20px;flex-wrap:wrap;"><a class="sfx-udl" href="privacy.html">Privacy Policy</a><a class="sfx-udl" href="terms.html">Terms &amp; Conditions</a><a class="sfx-udl" href="refunds.html">Refund &amp; Returns</a></div>' +
        '</div>' +
      '</div></footer>';
  }

  function injectShapes() {
    if (document.querySelector('.f2p-shapes')) return;
    var d = document.createElement('div');
    d.className = 'f2p-shapes';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<span class="r1"></span><span class="r2"></span><span class="r3"></span>';
    document.body.insertBefore(d, document.body.firstChild);
  }

  function updateCartBadge() {
    var badge = document.getElementById('shx-cart-badge');
    if (!badge || !window.F2P) return;
    var n = window.F2P.cartCount();
    if (n > 0) { badge.textContent = n; badge.style.display = 'flex'; }
    else { badge.style.display = 'none'; }
  }

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      // Make sure everything is visible if we can't animate.
      document.documentElement.classList.remove('reveal-on');
      return;
    }
    var els = document.querySelectorAll('.js-rv');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: reveal anything the observer missed (e.g. fast jump-scrolls) so
    // content is never left invisible.
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 1600);
  }

  function initParallaxAndSticky() {
    var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-px]'));
    var stickies = Array.prototype.slice.call(document.querySelectorAll('.f2p-header'));
    if (!pxEls.length && !stickies.length) return;
    var ticking = false;
    function frame() {
      ticking = false;
      var vh = window.innerHeight || 800;
      stickies.forEach(function (h) {
        if (window.scrollY > 16) h.classList.add('shrunk'); else h.classList.remove('shrunk');
      });
      if (!reduceMotion) {
        pxEls.forEach(function (el) {
          var sp = parseFloat(el.getAttribute('data-px')) || 0;
          var r = el.getBoundingClientRect();
          var off = ((r.top + r.height / 2) - vh / 2) * sp;
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        });
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    requestAnimationFrame(frame);
  }

  function initHeaderFooter() {
    var h = document.getElementById('site-header');
    if (h) {
      var active = h.getAttribute('data-active') || currentPage();
      h.innerHTML = headerHTML(active);
      var burger = document.getElementById('shx-burger');
      var mobile = document.getElementById('shx-mobile');
      if (burger && mobile) {
        burger.addEventListener('click', function () {
          mobile.style.display = mobile.style.display === 'none' ? 'block' : 'none';
        });
      }
    }
    var f = document.getElementById('site-footer');
    if (f) f.innerHTML = footerHTML();
    updateCartBadge();
    window.addEventListener('f2p-change', updateCartBadge);
    window.addEventListener('storage', updateCartBadge);
  }

  function boot() {
    injectShapes();
    initHeaderFooter();
    initReveal();
    initParallaxAndSticky();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
