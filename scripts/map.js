const weatherBox = document.getElementById('weather-box');
const getWeatherFromStorage = () => {
	let data = JSON.parse(localStorage.getItem('smashit'));

	// if (!data) {
	// 	console.log('No data to fetch');
	// 	return 'No data to fetch';
	// }

	const {
		cityName,
		countryName,
		data: {
			daily,
			current: {
				sunrise,
				sunset,
				temp,
				weather: [{ main, description, icon }]
			},
			lat,
			lon
		}
	} = data;

	displayWeatherDaily(daily);
};

const displayWeatherDaily = props => {
	let htmlTemplate = '';
	props.forEach((prop, index) => {
		htmlTemplate += `
        <div class="weather__box">
            <h3>Day-${index + 1} <span>${new Date(
			prop.sunrise * 1000
		).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			weekday: 'short'
		})}</span></h3>
                <div class="weather__box--content">
                    <div class="weather__box-top">
                        <ul>
                            <li>Humidity- <span>${prop.humidity}%</span></li>
                            <li>Weather- <span>${
															prop.weather[0].main
														}</span></li>
                        </ul>
                    </div>
                    <div class="weather__box-bottom">
                        <ul>
                            <li>Temperature- <span>${Math.round(
															prop.temp.day
														)}<sup>0</sup>C</span></li>
                            <li>Wind_speed- <span>${Math.round(
															prop.wind_speed
														)}/s</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
	});

	weatherBox.innerHTML = htmlTemplate;
};

getWeatherFromStorage();
