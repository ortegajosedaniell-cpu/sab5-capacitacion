// ── SAB-5 Service Worker — Network First + Auto Update ──────────
const CACHE_NAME = 'sab5-v20260413-134759';
const URLS = ['./', './index.html'];

// Al instalar: cachear recursos base
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
  self.skipWaiting(); // activar de inmediato sin esperar
});

// Al activar: borrar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // tomar control de todas las pestañas abiertas
});

// Fetch: Network First — siempre intenta la red, usa caché solo si falla
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guardar copia fresca en caché
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
