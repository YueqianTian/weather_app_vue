export default {
	setCities(state, payload) {
		state.savedCities = payload;
	},
	addCity(state, payload) {
		state.savedCities.push(payload);
	},
	deleteCitiesWeather(state) {
		delete state.weather;
	},
	setSearchResults(state, payload) {
		state.searchResults = payload;
	},
	setSearchedCity(state, payload) {
		state.searchedCity = payload;
	},
};
