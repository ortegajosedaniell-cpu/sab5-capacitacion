// SW deshabilitado - auto-update via version.json
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))); self.clients.claim(); });
