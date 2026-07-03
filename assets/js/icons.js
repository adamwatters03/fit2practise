/* Fit to Practise — inline SVG icon set.
   On-brand line icons that inherit the surrounding text colour (currentColor),
   so they pick up the plum / green / white already used in the markup.

   Two ways to use:
   1. Static HTML:  <span data-icon="cart"></span>   (auto-replaced on load)
   2. JS-built markup:  window.F2PIcon('cart', { size: 20 })  -> returns an <svg> string
*/
(function () {
  'use strict';

  // 24x24 viewBox inner markup for each icon.
  var P = {
    user:      '<circle cx="12" cy="8" r="3.6"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
    cart:      '<path d="M6.5 8h11l-1 10.5a1.5 1.5 0 0 1-1.5 1.3H9a1.5 1.5 0 0 1-1.5-1.3L6.5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    pulse:     '<path d="M3 12h4l2.2-6 3.6 12 2.2-6H21"/>',
    grad:      '<path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z"/><path d="M6.5 10.5V15c0 1.6 2.6 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.5"/><path d="M21.5 8.5v5"/>',
    trophy:    '<path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4v1.5A3 3 0 0 0 7 9.5"/><path d="M17 5h3v1.5a3 3 0 0 1-3 3"/><path d="M12 13v3.5"/><path d="M8.5 20h7"/><path d="M9.5 20a2.5 2.5 0 0 1 5 0"/>',
    book:      '<path d="M6 3.5h11.5v17H7A1.5 1.5 0 0 0 5.5 22V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M5.5 18.5h12"/>',
    bookOpen:  '<path d="M12 6.5C10 5.2 7 5 4.5 5.6v12C7 17 10 17.2 12 18.5c2-1.3 5-1.5 7.5-.9v-12C17 4.9 14 5.1 12 6.5Z"/><path d="M12 6.5v12"/>',
    chart:     '<path d="M4.5 4.5v15h15"/><path d="M8 15l3.5-4 3 2.5 4.5-5.5"/>',
    calendar:  '<rect x="4" y="5" width="16" height="15.5" rx="2"/><path d="M4 9.5h16"/><path d="M8.5 3v4"/><path d="M15.5 3v4"/>',
    bell:      '<path d="M6 9.5a6 6 0 0 1 12 0c0 4.2 1.6 5.5 1.6 5.5H4.4S6 13.7 6 9.5Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
    globe:     '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.4 2.6 14.6 0 17"/><path d="M12 3.5c-2.6 2.4-2.6 14.6 0 17"/>',
    grid:      '<rect x="4" y="4" width="7" height="7" rx="1.3"/><rect x="13" y="4" width="7" height="7" rx="1.3"/><rect x="4" y="13" width="7" height="7" rx="1.3"/><rect x="13" y="13" width="7" height="7" rx="1.3"/>',
    users:     '<circle cx="9" cy="8" r="3.4"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.4 3.4 0 0 1 0 6.6"/><path d="M17 19.5a5.5 5.5 0 0 0-2.6-4.7"/>',
    compass:   '<circle cx="12" cy="12" r="8.5"/><path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z"/>',
    pencil:    '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
    chat:      '<path d="M20 14.5A2.5 2.5 0 0 1 17.5 17H9l-4 3.5V6.5A2.5 2.5 0 0 1 7.5 4h10A2.5 2.5 0 0 1 20 6.5v8Z"/>',
    scales:    '<path d="M12 4v16"/><path d="M7 20h10"/><path d="M4 8h16"/><path d="M8 4.8 4 8"/><path d="m16 4.8 4 3.2"/><path d="M4 8l-2 4.2a2.4 2.4 0 0 0 4.8 0L4.8 8"/><path d="M20 8l-2 4.2a2.4 2.4 0 0 0 4.8 0L20.8 8"/>',
    lock:      '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    play:      '<path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor" stroke="none"/>',
    bookmark:  '<path d="M7 4h10v16.5l-5-3.2-5 3.2V4Z"/>',
    progress:  '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none"/>',
    envelope:  '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 5.5L20 7"/>',
    clock:     '<circle cx="12" cy="13" r="7.5"/><path d="M12 13V9"/><path d="M9.5 2.5h5"/><path d="M12 2.5v3"/>',
    power:     '<path d="M12 3.5v8"/><path d="M6.8 6.8a7.5 7.5 0 1 0 10.4 0"/>',
    star:      '<path d="m12 3.2 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.3l1-5.8-4.3-4.1 5.9-.8L12 3.2Z" fill="currentColor" stroke="none"/>',
    trendUp:   '<path d="M4 15.5 9.5 10l3 2.6L20 5.5"/><path d="M20 5.5h-5"/><path d="M20 5.5v5"/>',
    external:  '<path d="M14 5h5v5"/><path d="M19 5 11 13"/><path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5"/>',
    check:     '<path d="M5 12.5 10 17.5 19 6.5"/>'
  };

  function build(name, opts) {
    opts = opts || {};
    var inner = P[name];
    if (!inner) return '';
    var size = opts.size ? (typeof opts.size === 'number' ? opts.size + 'px' : opts.size) : '1em';
    var sw = opts.stroke || 1.7;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" ' +
      'stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" ' +
      'style="display:inline-block;vertical-align:-0.14em;flex-shrink:0;" aria-hidden="true">' + inner + '</svg>';
  }

  window.F2PIcon = build;

  function scan(root) {
    var els = (root || document).querySelectorAll('[data-icon]');
    Array.prototype.forEach.call(els, function (el) {
      if (el.getAttribute('data-icon-done')) return;
      var name = el.getAttribute('data-icon');
      var size = el.getAttribute('data-size');
      var sw = el.getAttribute('data-stroke');
      el.innerHTML = build(name, { size: size || '1em', stroke: sw ? parseFloat(sw) : 1.7 });
      el.setAttribute('data-icon-done', '1');
    });
  }
  window.F2PIconScan = scan;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(document); });
  else scan(document);
})();
