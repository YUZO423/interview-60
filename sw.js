// ビルド時に、全ローカル資産とバージョンを埋め込みます。
const CACHE = 'interview60-1795410650665';
const ASSETS = ["./assets/index-CchStfag.css","./assets/index-J3gu2i1u.js","./assets/read-excel-file-S93-Ej8n.js","./icon-192.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest"];
self.addEventListener('install', event => {
  // 新版のキャッシュへ古いHTTPキャッシュのHTMLを混ぜない。
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(ASSETS.map(asset => new Request(new URL(asset, self.location.href), { cache: 'no-store' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  // 開きっぱなしの旧版が使う資産も残す。IndexedDBには触れない。
  event.waitUntil(caches.keys().then(keys => {
    const old = keys.filter(k => k.startsWith('interview60-') && k !== CACHE).sort().reverse();
    return Promise.all(old.slice(2).map(k => caches.delete(k)));
  }).then(() => self.clients.claim()));
});
async function currentPage(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(request, { cache: 'no-store', signal: controller.signal });
    if (response.ok) return response;
    throw new Error('ページを取得できませんでした。');
  } catch {
    // HTMLだけを上書きせず、オフラインでは同じ版のHTMLと資産を使う。
    const cache = await caches.open(CACHE);
    return await cache.match(new URL('./index.html', self.location.href)) || new Response(
      '<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>面接60</title><p>接続を確認して、もう一度開いてください。保存した問題・履歴は削除されていません。</p></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } finally { clearTimeout(timer); }
}
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  // 通常起動はネットワーク優先。オフライン・接続遅延時のみキャッシュへ戻る。
  if (event.request.mode === 'navigate') {
    event.respondWith(currentPage(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
