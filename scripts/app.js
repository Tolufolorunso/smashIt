if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(reg => console.log('registered'))
		.catch(error => console.log('Service worker not register', error));
}
