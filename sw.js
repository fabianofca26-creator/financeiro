/* Service worker: existe por dois motivos.
   1. O Chrome do Android só oferece "instalar" se a página tiver um.
   2. Servido pelo Pages, sem isto o app não abre sem internet — e ele é um app offline.

   Estratégia: rede primeiro, cache como reserva.
   Cache primeiro seria mais rápido, mas prenderia o app numa versão velha para
   sempre, que é bem pior do que meio segundo a mais de carregamento. */
const CACHE = 'financeiro-v1';
const ESSENCIAL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ESSENCIAL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        /* só guarda resposta boa: cachear um erro deixaria o app quebrado offline */
        if (r && r.ok) {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia));
        }
        return r;
      })
      .catch(() => caches.match(e.request)
        .then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
