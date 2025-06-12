const CACHE_NAME = 'barcode-cache';
const urlsToCache = [
    '/QRCode20250612/',
    '/QRCode20250612/index.html',
    '/QRCode20250612/manifest.json',
    '/QRCode20250612/GBP.LOGO.png',
    '/QRCode20250612/category.js',
    '/QRCode20250612/styles.css',
];

// 安裝 Service Worker 並快取資源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // 立即啟用新 SW
});

// 清除舊的 Cache
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 讓新的 SW 立即接管所有頁面
    );
});

// 攔截請求
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        // 對 HTML 採用 Network First
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match(event.request)) // 如果網路請求失敗，回退到 Cache
        );
    } else {
        // 其他資源採用 Cache First
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
});
