// service-worker.js
const CACHE_NAME = 'barcode-cache';
const urlsToCache = [
    '/barcode/index.html',
    '/barcode/manifest.json',
    '/barcode/GBP.LOGO.png',
    '/barcode/category.js',
    '/barcode/styles.css',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
