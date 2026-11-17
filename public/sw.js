const CACHE_NAME = "joynook-pwa-v1";

const PRECACHE_ASSETS = [
  "/",
  "/games",
  "/favorites",
  "/about",
  "/contact",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/games/bubble-pop",
  "/games/2048",
  "/games/virtual-bubble-wrap",
  "/games/color-sort",
  "/games/tic-tac-toe",
  "/games/breathing-exercise"
];

// Install: precache critical assets & take over immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("Some assets could not be precached offline:", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Network-first for navigation with cache fallback, Cache-first for static assets
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore non-GET requests or chrome-extension URLs
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  // Navigation requests (HTML pages): Network first, then cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // Fallback to home page if navigating offline
          const fallback = await caches.match("/");
          return fallback || new Response("You are offline. JoyNook games are ready once loaded!", {
            headers: { "Content-Type": "text/html" }
          });
        })
    );
    return;
  }

  // Static Assets (JS, CSS, Images, Fonts, Icons)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
