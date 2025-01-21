// service-worker.js
const CACHE_NAME = 'barcode-cache';
const urlsToCache = [
    '/barcode/',
    '/barcode/index.html',
    '/barcode/manifest.json',
    '/barcode/GBP.LOGO.png',
    '/barcode/category.js',
    '/barcode/styles.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 註冊一個 'activate' 事件的監聽器
this.addEventListener('activate', function(event) {
  // 使用 event.waitUntil 確保此事件中的異步操作完成前，Service Worker 不會被終止
  event.waitUntil(
    // 取得所有的快取鍵 (cache keys)
    caches.keys().then(function(cacheNames) {
      // 使用 Promise.all 處理多個異步操作
      return Promise.all(
        // 過濾需要移除的快取
        cacheNames.filter(function(cacheName) {
          // 在這裡檢查快取名稱 (cacheName)，
          // 回傳 true 的快取會被標記為需要刪除。
          // 通常用於刪除舊的快取或非必要的快取。
        }).map(function(cacheName) {
          // 刪除符合條件的快取
          return caches.delete(cacheName);
        })
      );
    })
  );
});
