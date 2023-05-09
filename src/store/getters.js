export default {
	searchResults(state) {
		return state.searchResults;
	},
	savedCities(state) {
		return state.savedCities;
	},
	dailyWeather(state) {
		return state.detailedCityWeather.daily;
	},
	hourlyWeather(state) {
		return state.detailedCityWeather.hourly;
	},
	sunriseData(state) {
		return state.detailedCityWeather.sunrises;
	},
};
