// Very small cache-first service worker for assets & offline fallback.
const CACHE = 'clinpwa-cache-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  const req = evt.request;
  if (req.method !== 'GET') return;
  evt.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        if (resp && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return resp;
      }).catch(()=>caches.match(OFFLINE_URL));
    })
  );
});
