if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(reg => console.log('registered'))
		.catch(error => console.log('Service worker not register', error));
}

const getYear = document.getElementById('get-year');
let getFullYear = new Date().getFullYear();

getYear.textContent = getFullYear;
