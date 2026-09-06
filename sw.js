/* ==========================================================================
   AWALIM — service worker. Repeat visits load from cache instantly, and the
   site still opens without a network. Strategies:
   · documents & JSON: network-first, fall back to cache, then /offline
   · css/js: stale-while-revalidate (fresh on the next load)
   · fonts/images/vendor: cache-first (immutable, versioned by URL)
   The cache name carries the build stamp; activating a new build drops
   every older cache.
   ========================================================================== */
const VERSION = "awalim-5d7552a2";
const OFFLINE = "/offline";
const OFFLINE_EN = "/en/offline";
const PRECACHE = [OFFLINE, OFFLINE_EN, "/assets/css/awalim.css", "/assets/js/awalim.js", "/assets/js/motion.js", "/assets/js/extras.js", "/assets/vendor/lenis.min.js", "/assets/img/awalim-mark.webp"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const isDoc = (req) => req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
const isImmutable = (url) => /\/assets\/(fonts|img|vendor)\//.test(url.pathname);
const isCode = (url) => /\/assets\/(css|js)\//.test(url.pathname);

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (isDoc(req) || url.pathname.endsWith(".json")) {
    e.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((hit) => hit || (isDoc(req) ? caches.match(url.pathname.startsWith("/en") ? OFFLINE_EN : OFFLINE) : Response.error())))
    );
    return;
  }
  if (isImmutable(url)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })));
    return;
  }
  if (isCode(url)) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => hit);
        return hit || net;
      })
    );
  }
});
