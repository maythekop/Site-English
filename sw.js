/* Site English — service worker
 * เก็บเฉพาะหน้าเปิดแอป + ไอคอน ไว้เปิดได้แม้ไม่มีเน็ต (แสดงข้อความให้ต่อเน็ต)
 * ไม่แคชตัวเว็บแอป Google Apps Script (ข้อมูลต้องสดเสมอ)
 * ⚠️ แก้ไฟล์ใน repo แล้ว ให้เพิ่มเลขเวอร์ชันด้านล่าง เครื่องจะโหลดของใหม่ */
var CACHE = 'site-english-shell-v6';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* หน้าเปิดแอป: ลองเน็ตก่อน (ได้ของใหม่) ไม่มีเน็ตค่อยใช้ของในแคช · ไฟล์อื่นในโดเมนนี้: แคชก่อน */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
      return res;
    }).catch(function () { return caches.match('./index.html'); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req); }));
});
