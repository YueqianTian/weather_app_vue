export default {
	setCities(state, payload) {
		state.savedCities = payload;
	},
	addCity(state, payload) {
		state.savedCities.push(payload);
	},
	setDetailedCityWeather(state, payload) {
		state.detailedCityWeather = payload;
	},
	deleteWeather(state) {
		delete state.weather;
	},
	setSearchResults(state, payload) {
		state.searchResults = payload;
	},
};
