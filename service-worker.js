self.addEventListener('install', (event) => {
    console.log('Service Worker 安裝中...');
    event.waitUntil(
        caches.open('cache').then((cache) => {
            return cache.addAll([
                '/index.html',
                '/manifest.json',
                '/GBP.LOGO.png',
            ]);
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
