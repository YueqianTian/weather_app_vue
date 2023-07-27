import icons from '../json/iconcodeConversion.json';

// get icon url
const isDaytimeOrNighttime = (sunrisesData, hour) => {
	const hourTimestamp = new Date(hour).getTime();
	let isNighttime = true;

	sunrisesData.forEach((day) => {
		const sunrise = day.data_time + ' ' + day.sunrise;
		const sunset = day.data_time + ' ' + day.sunset;
		const sunriseTimestamp = new Date(sunrise).getTime();
		const sunsetTimestamp = new Date(sunset).getTime();
		if (
			hourTimestamp >= sunriseTimestamp &&
			hourTimestamp <= sunsetTimestamp
		) {
			isNighttime = false;
		}
	});
	return isNighttime;
};

const iconcodeConvertedToUrl = (iconcode, n) => {
	// load = false, +load = 0
	// load = true, +load = 1
	const code =
		Array.isArray(iconcode) && iconcode.length > 1
			? iconcode[+n]
			: iconcode;

	return new URL(`../icon/icon__${code}.png`, import.meta.url).href;
};

export const getIconUrl = (data, isHourlyWeather = false) => {
	const { weatherData, sunrisesData } = data;
	// get icon code
	const selectedIcon = icons.find(
		(icon) =>
			icon.code ===
			(isHourlyWeather ? weatherData.code : weatherData.code_day)
	);
	// Hourly Weather
	if (isHourlyWeather) {
		const isNighttime = isDaytimeOrNighttime(
			sunrisesData,
			weatherData.data_time
		);
		return iconcodeConvertedToUrl(selectedIcon.icon__code, isNighttime);
	}
	// Daily Weather
	else {
		return iconcodeConvertedToUrl(selectedIcon.icon__code, false);
	}
};
