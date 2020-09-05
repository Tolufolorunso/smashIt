const staticCacheName = 'site-static-v88';
const assets = [
	'/',
	'/index.html',
	'/contact.html',
	'/about.html',
	'/styles/beautify.css',
	'/scripts/life.js',
	'/scripts/map.js',
	'/scripts/app.js',
	'/images/bg.jpg',
	'/images/Tolufolorunso.jpg',
	'/images/smashIt.png',
	'/images/osman-rana-HOtPD7Z_74s-unsplash.jpg',
	'/favicon.ico',
	'/fallback.html',
	'/weather.html',
	'./images/icons/android-72x72.png',
	'./images/icons/apple-touch-icon-180x180.png',
	'./images/icons/browserconfig.xml',
	'./images/icons/pwa-192x192.png',
	'./images/icons/pwa-512x512.png',
	'./images/icons/smashIt.png',
	'./images/smashIt.png',
	'./images/icons/favicon-16x16.png',
	'./images/icons/favicon-32x32.png',
	'./favicon.ico',
	'./images/evening.jpg',
	'./images/flowers.jpg',
	'./images/storm.jpg',
	'./images/thunder.jpg',
	'./images/tree-1.jpg',
	'./images/tree-2.jpg',
	'./images/tree-3.jpg',
	'./images/tree.jpg',
	'https://fonts.googleapis.com/css2?family=Lato:ital@0;1&family=Merriweather:ital,wght@0,400;0,700;1,700&display=swap\n"rel =\n"stylesheet'
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
	// evt.waitUntil(
	// 	caches.keys().then(keys => {
	// 		return Promise.all(
	// 			keys
	// 				.filter(key => key !== staticCacheName)
	// 				.map(key => caches.delete(key))
	// 		);
	// 	})
	// );
	evt.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(
				keyList.map(key => {
					if (key !== staticCacheName) {
						console.log('[ServiceWorker] Removing old cache', key);
						return caches.delete(key);
					}
				})
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
	// if (evt.request.mode !== 'navigate') {
	// 	// Not a page navigation, bail.
	// 	return;
	// }
	// evt.respondWith(
	// 	fetch(evt.request).catch(() => {
	// 		return caches.open(staticCacheName).then(cache => {
	// 			return cache.match('fallback.html');
	// 		});
	// 	})
	// );
});
