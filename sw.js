/* Site English — service worker
 * เก็บหน้าแอป + config.js + ไอคอน ไว้เปิดได้แม้ไม่มีเน็ต (เรื่อง/ผลการฝึกแอปเก็บเองใน localStorage)
 * ไม่แคชข้อมูลจาก Google Apps Script (ข้อมูลต้องสดเสมอ)
 * ⚠️ แก้ไฟล์ใน repo แล้ว ให้เพิ่มเลขเวอร์ชันด้านล่าง เครื่องจะโหลดของใหม่ */
var CACHE = 'site-english-shell-v8';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(SHELL).then(function () { return c.add('./config.js').catch(function () {}); });   /* ยังไม่มี config.js ก็ติดตั้งได้ */
  }).then(function () { return self.skipWaiting(); }));
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
  if (/\/config\.js$/.test(new URL(req.url).pathname)) {   /* ลิงก์แอป: เน็ตก่อน (แก้แล้วมีผลทันที) ไม่มีเน็ตใช้ของที่เก็บไว้ */
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./config.js', copy); }); }
      return res;
    }).catch(function () { return caches.match('./config.js'); }));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
      return res;
    }).catch(function () { return caches.match('./index.html'); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req); }));
});
