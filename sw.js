const staticCacheName = 'site-static-v1';
const assets = [
	'/',
	'/index.html',
	'/contact.html',
	'/about.html',
	'/styles/beautify.css',
	'/scripts/life.js',
	'/images/bg.jpg',
	'/images/smashIt.png',
	'/images/osman-rana-HOtPD7Z_74s-unsplash.jpg',
	'/favicon.ico',
	'/fallback.html',
	'/weather.html'
];

// 1. Install ServiceWorker

self.addEventListener('install', evt => {
	self.skipWaiting();
	evt.waitUntil(
		caches.open(staticCacheName).then(cache => {
			return cache.addAll(assets);
		})
	);
});

// 2. Activate ServiceWorker
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(
				keys
					.filter(key => key !== staticCacheName)
					.map(key => caches.delete(key))
			);
		})
	);
});

// 3. Fetch ServiceWorker

self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches
			.match(evt.request)
			.then(cacheRes => {
				return cacheRes || fetch(evt.request);
			})
			.catch(() => {
				if (evt.request.url.indexOf('.html') > -1) {
					return caches.match('/fallback.html');
				}
			})
	);
});
