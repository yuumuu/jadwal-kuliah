// ============================================================
// Service Worker — cache aset statis, SWR untuk data
// ============================================================

const VERSION = "v2.0.0";
const STATIC_CACHE = `jadkul-static-${VERSION}`;
const DATA_CACHE = `jadkul-data-${VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./css/tokens.css",
  "./css/app.css",
  "./js/app.js",
  "./js/data.js",
  "./js/theme.js",
  "./js/ui.js",
  "./js/utils.js",
  "./js/views.js",
  "./manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== STATIC_CACHE && k !== DATA_CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin) return;

  // Data: stale-while-revalidate
  if (url.pathname.includes("/data/")) {
    e.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cached = await cache.match(e.request);
        const fetchPromise = fetch(e.request).then((res) => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Static: cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      if (res.ok && STATIC_ASSETS.some((a) => url.pathname.endsWith(a.replace("./", "")))) {
        caches.open(STATIC_CACHE).then((c) => c.put(e.request, res.clone()));
      }
      return res;
    }))
  );
});