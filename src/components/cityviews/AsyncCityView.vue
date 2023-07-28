<template>
	<div class="flex flex-col flex-1 items-center">
		<!-- Banner -->
		<div
			v-if="route.query.preview"
			class="text-white p-4 bg-weather-secondary w-full text-center"
		>
			<p>您正在预览该地区的天气预报。如需订阅，单击图标 “+” 。</p>
		</div>

		<!-- Weather Overview -->
		<CityOverview />

		<!-- Hourly Weather  -->
		<HourlyWeather @click="goToIndexView('temp_fc')" />

		<!-- Daily Weather -->
		<DailyWeather
			@dateSelected="getSelectedDate"
			@click="goToIndexView('temp_fc', selectedDate)"
		/>

		<!-- Other index -->
		<div class="flex gap-4 max-w-screen-md w-full pb-12">
			<IndexOfHumidity @click="goToIndexView('rh')" />
			<IndexOfFeelsLike @click="goToIndexView('feels_like')" />
		</div>

		<!-- Unsubscribe -->
		<div
			class="flex items-center gap-2 pb-12 text-white cursor-pointer duration-150 hover:text-red-500"
			@click="removeCity"
			v-if="route.query.id"
		>
			<i class="fa-solid fa-trash"></i>
			<p>取消订阅</p>
		</div>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { provide, computed, ref } from 'vue';
import CityOverview from './CityOverview.vue';
import HourlyWeather from './HourlyWeather.vue';
import DailyWeather from './DailyWeather.vue';
import IndexOfHumidity from './IndexOfHumidity.vue';
import IndexOfFeelsLike from './IndexOfFeelsLike.vue';

const route = new useRoute();
const router = new useRouter();
const store = new useStore();
const savedCities = computed(() => store.getters.savedCities);
const searchedCity = computed(() => store.getters.searchedCity);
const indexGroup = computed(() => store.getters.indexGroup);
const selectedDate = ref('');

const getSelectedDate = (day) => {
	selectedDate.value = day;
};

// Get city weather
const selectedCityWeather = async () => {
	let weatherData;

	// 1. If city weather in 'store / searchedCity'
	if (
		searchedCity.value &&
		searchedCity.value.adcode === route.query.adcode
	) {
		weatherData = searchedCity.value.weather;
	}
	// 2. If the city in 'citylist' and weather data saved in homepage
	else {
		if (
			savedCities.value.length > 0 &&
			savedCities.value.find(
				(city) => city?.adcode === route.query.adcode
			)
		) {
			weatherData = savedCities.value.find(
				(city) => city?.adcode === route.query.adcode
			).weather;
		} else {
			// 3. Async weather data from API
			try {
				weatherData = await store.dispatch('getWeatherData', {
					adcode: route.query.adcode,
				});
			} catch (err) {
				console.error(err);
			}
		}

		// Save the city weather in the 'store / searchedCity' whether it has been loaded in citylist or not
		let cityObj = {
			adcode: route.query.adcode,
			name: route.params.city,
		};
		cityObj.weather = weatherData;
		store.commit('setSearchedCity', cityObj);
	}

	// Flicker delay
	await new Promise((res) => setTimeout(res, 500));
};
await selectedCityWeather();

// Remove city
const removeCity = () => {
	const updatedCities = savedCities.value.filter(
		(city) => city.id !== route.query.id
	);

	store.commit('setCities', updatedCities);

	store.commit('deleteCitiesWeather');

	store.dispatch('storeSavedCities', updatedCities);

	router.push({ name: 'home' });
};

// Go to index view
const goToIndexView = (indexId, date = new Date()) => {
	const selectedIndex = indexGroup.value.find(
		(index) => index.id === indexId
	);
	const { id } = selectedIndex;

	const query = Object.assign({}, route.query);
	router.push({
		name: 'indexView',
		params: { index: id },
		query: { ...query, date: date ? date : new Date() },
	});
};

provide('hourlyWeather', searchedCity.value?.weather?.hourly);
provide('dailyWeather', searchedCity.value?.weather?.daily);
provide('sunrisesData', searchedCity.value?.weather?.sunrises);
</script>
