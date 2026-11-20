// ビルド時に、全ローカル資産とバージョンを埋め込みます。
const CACHE = 'interview60-1795135638340';
const ASSETS = ["./assets/index-BX9mXHAJ.js","./assets/index-DwfjKbcM.css","./assets/read-excel-file-S93-Ej8n.js","./icon-192.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('interview60-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  // ナビゲーションも即座にキャッシュを返す。通信タイムアウトを待たない。
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match(new URL('./index.html', self.location.href)).then(shell => shell || fetch(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => {
    if (event.request.mode === 'navigate') return caches.match(new URL('./index.html', self.location.href));
    return Response.error();
  })));
});
