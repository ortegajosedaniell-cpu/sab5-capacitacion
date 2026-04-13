// SW v3 - DESHABILITADO: se auto-destruye, limpia todo y fuerza recarga
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll({ type: 'window' }).then(function(clients) {
        clients.forEach(function(c) {
          c.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
});
// Sin cache: todas las requests van directo a la red
self.addEventListener('fetch', function(e) {});
