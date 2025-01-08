self.addEventListener('install', (event) => {
    console.log('Service Worker 安裝中...');
    event.waitUntil(
        caches.open('barcode-cache').then((cache) => {
            return cache.addAll([
                '/barcode/index.html',
                '/barcode/manifest.json',
                '/barcode/GBP.LOGO.png',
                '/barcode/category.js',
                '/barcode/styless.css',
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
