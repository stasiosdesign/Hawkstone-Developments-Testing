// Hawkstone — shared Lenis smooth-scroll init.
// Loaded (with the Lenis library, via CDN) on every page in this site
// except services/rural-conversions/index.html, which is finished,
// client-approved work and is not touched by anything added elsewhere.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis === 'undefined') return;
  window.lenis = new Lenis({ autoRaf: true });
})();
