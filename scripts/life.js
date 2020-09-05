const city = document.getElementById('city');
const cityBox = document.getElementById('city-box');
const iconUrl = document.getElementById('icon');
const cityCondition = document.getElementById('city-condition');
const degUI = document.getElementById('deg');
const table = document.getElementById('table');
const hr = document.getElementById('hour');
const min = document.getElementById('minute');
const sec = document.getElementById('second');
const date = document.getElementById('date');
const apUi = document.getElementById('ap');
const alert = document.getElementById('alert');
const searchForm = document.getElementById('search');

const openWeatherToken = 'd2d2d256214cf836218a23bd385446f5';

const mobileBtn = document.querySelector('.navigation__button');
const isChecked = document.querySelector('.navigation__checkbox');
const mobileMenuContainer = document.querySelector('.mobile__menu-container');
mobileBtn.addEventListener('click', evt => {
	console.log(isChecked.checked);
	const mobileMenu = document.querySelector('.mobile__menu');
	if (isChecked.checked) {
		mobileMenu.classList.remove('showIcon');
		mobileMenu.style.zIndex = '1000';
		mobileMenuContainer.classList.remove('menu-container');

		// document.querySelector('header').style.zIndex = '-1000';
		// document.querySelector('footer').style.zIndex = '-1000';
	} else {
		mobileMenu.classList.add('showIcon');
		mobileMenuContainer.classList.add('menu-container');
	}
});

const eventListener = () => {
	if (searchForm) {
		searchForm.addEventListener('submit', searchCity);
	}

	document.addEventListener('DOMContentLoaded', defaultCityLoaded);
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
};

const updateOnlineStatus = evt => {
	if (!navigator.onLine) {
		showAlert(
			'fail',
			'You are offline, current information may not be accurate'
		);
		console.log('offline');
	} else {
		showAlert('success', 'You are back online');
		console.log('online');
	}
};

const addToLocalStorage = props => {
	localStorage.setItem('smashit', JSON.stringify(props));
};

const displayTime = () => {
	const now = new Date();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	const todayDate = now.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	let ap = 'AM';
	if (hour > 11) ap = 'PM';
	if (hour > 12) hour = hour - 12;
	if (hour === 0) hour = 12;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	date.textContent = todayDate;
	hr.textContent = hour;
	min.textContent = minutes;
	sec.textContent = seconds;
	apUi.textContent = ap;
};

const displayData = props => {
	const {
		cityName,
		countryName,
		data: {
			current: {
				sunrise,
				sunset,
				temp,
				weather: [{ main, description, icon }]
			},
			lat,
			lon
		}
	} = props;

	// console.log(
	// 	cityName,
	// 	lat,
	// 	lon,
	// 	countryName,
	// 	main,
	// 	description,
	// 	icon,
	// 	temp,
	// 	sunrise,
	// 	sunset
	// );

	let sec, date, localTime;

	if (countryName !== 'NG') {
		sec = sunrise;
		date = new Date(sec * 1000);
		localTime = date.toLocaleTimeString();
	} else {
		date = new Date();
		localTime = date.toLocaleTimeString();
	}

	table.innerHTML = `
	<table>
	     <tr>
	        <td>Country</td>
	        <td>${countryName}</td>
	    </tr>
	        <tr>
	            <td>Latitude</td>
	            <td>${lat}</td>
	        </tr>
	        <tr>
	            <td>Longitude</td>
	            <td>${lon}</td>
	        </tr>
	        <tr>
	            <td>Description</td>
	            <td>${description.toUpperCase()}</td>
	        </tr>
	        <tr>
	            <td>Temperature</td>
	            <td>${Math.round(temp)}</td>
			</tr>
			<tr>
	            <td>Date</td>
	            <td>${date.toLocaleDateString()}</td>
			</tr>
			<tr>
	            <td>Local Time</td>
	            <td>${localTime}</td>
	        </tr>
	    </table>
	`;

	degUI.innerHTML = `${Math.round(temp)} <sup>0</sup>C`;
	cityCondition.textContent = main;
	cityCondition.classList.add('city-condition');
	cityBox.textContent = cityName;
	const iconSrc = `http://openweathermap.org/img/w/${icon}.png`;
	iconUrl.setAttribute('src', iconSrc);
};

// Show alert for action on the page
const showAlert = (alertType, alertMessage) => {
	var alertDiv = document.getElementById('alert');
	var alertParagraph = document.getElementById('alert-p');

	if (alertType === 'success') {
		alertParagraph.textContent = alertMessage;
		alertDiv.style.background = 'green';
		alertDiv.style.opacity = 1;
	} else {
		alertParagraph.textContent = alertMessage;
		alertDiv.style.background = 'red';
		alertDiv.style.opacity = 1;
	}

	setTimeout(function () {
		alertParagraph.textContent = '';
		alertDiv.style.background = '';
		alertDiv.style.opacity = 0;
	}, 3000);
};

const fetchCityAndCountry = async props => {
	try {
		let url;
		if (props.cityName) {
			const { cityName, country } = props;
			if (country && cityName) {
				url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${country}&appid=${openWeatherToken}&units=metric`;
			} else {
				url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherToken}&units=metric`;
			}
		} else {
			const { lat, lon } = props;
			url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherToken}&units=metric`;
		}

		const fetchCity = await fetchWeatherDetail(url);

		const {
			coord: { lon, lat },
			sys: { country: countryName },
			name
		} = fetchCity;

		fetchDailyWeather({
			lon,
			lat,
			countryName,
			name
		});
	} catch (error) {
		showAlert('red', error.message);
	}
};

const map = (lat, lon) => {
	mapboxgl.accessToken =
		'pk.eyJ1IjoidG9sZm9sb3J1bnNvIiwiYSI6ImNrZTFsbXk0MzAwbjgzMHA2bm82Mm9kdWIifQ.WmgYZmUX1brBeTWUbEu5qA';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [lon, lat],
		zoom: 9
	});
	fetchCityAndCountry({ lat, lon });

	map.on('click', function (evt) {
		let i = JSON.stringify(evt.point);
		const { lng: lon, lat } = evt.lngLat.wrap();
		const body = {
			lon,
			lat
		};
		fetchCityAndCountry({ lon, lat });
	});
};

const searchCity = evt => {
	evt.preventDefault();
	if (city.value === '' && city.value.length < 2) {
		showAlert('green', 'Enter a city name');
		return false;
	}

	const value = city.value;
	let searchedData = value.split(' ').filter(Boolean);

	let cityName, country;

	if (searchedData.length > 1) {
		country = searchedData[searchedData.length - 1];
		searchedData.pop();
		cityName = searchedData.join(' ');
	} else {
		[cityName, undefined] = searchedData;
	}

	// const [cityName, country] = searchedData;

	city.value = '';

	fetchCityAndCountry({ cityName, country });
};

const fetchDailyWeather = props => {
	const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${props.lat}&lon=${props.lon}&exclude=hourly,minutely&appid=${openWeatherToken}&units=metric`;

	fetchWeatherDetail(URL)
		.then(data => {
			displayData({
				data,
				countryName: props.countryName,
				cityName: props.name
			});
			addToLocalStorage({
				data,
				countryName: props.countryName,
				cityName: props.name
			});
		})
		.catch(error => {
			return error;
		});
};

const defaultCityLoaded = () => {
	const dataFromStorage = localStorage.getItem('smashit');
	// Check if weather details found in local storage
	if (dataFromStorage) {
		const data = JSON.parse(dataFromStorage);
		displayData(data);
		const {
			data: { lat, lon }
		} = data;
		map(lat, lon);
	} else {
		// fetchCityAndCountry({ cityName: 'NY', country: 'USA' });
		// fetchDailyWeather({ lat: 40.7246229981713, lon: -73.98714967217245 });

		// New York as default
		map(40.73061, -73.98714967217245);
	}
};

const fetchWeatherDetail = async url => {
	const response = await fetch(url);
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		const data = await response.json();
		showAlert(data.message, 'red');
		throw Error(data.message);
	}
};

eventListener();
setInterval(displayTime, 1000);
