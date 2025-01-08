// service-worker.js
const CACHE_NAME = 'barcode-cache';
const urlsToCache = [
    '/barcode/index.html',
    '/barcode/manifest.json',
    '/barcode/GBP.LOGO.png',
    '/barcode/category.js',
    '/barcode/styless.css',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
