<template>
	<div class="flex flex-col flex-1 items-center">
		<div
			class="p-4 w-full mb-8 bg-black bg-opacity-10 flex justify-center items-baseline gap-2"
		>
			<i
				class="fa-solid fa-temperature-half text-2xl"
				v-show="
					activeIndex === 'feels_like' || activeIndex === 'temp_fc'
				"
			></i>
			<i class="fas fa-tint text-2xl" v-show="activeIndex === 'rh'"></i>
			<h2 class="text-xl">{{ selectedIndex?.indexName }}</h2>
		</div>

		<!-- calender: 10days -->
		<calendar-week @dateSelected="getSelectedDate"> </calendar-week>

		<hr class="text-[#eee] w-full opacity-10 m-4" />

		<!-- hourly index -->
		<hourly-index
			class="w-full"
			:active-date="selectedDate"
			:weather-data="weatherData"
			:current-time-index="currentTimeIndex"
			:sunrises-data="sunrisesData"
		></hourly-index>

		<!-- index introduction -->
		<ul class="max-w-screen-md flex flex-col justify-start mb-20 w-full">
			<index-intro
				:active-date="selectedDate"
				:weather-data="weatherData"
				:selected-index="selectedIndex"
				:current-time-index="currentTimeIndex"
			></index-intro>
		</ul>
	</div>
</template>

<script setup>
import HourlyIndex from './HourlyIndex.vue';
import CalendarWeek from './CalendarWeek.vue';
import IndexIntro from './IndexIntro.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import {
	newDate,
	getSecondDay,
	roundToHour,
	isToday,
} from '../charts/ChartActions.js';

const store = new useStore();
const route = new useRoute();
const activeIndex = computed(() => route.params.index);
const indexGroup = computed(() => store.getters.indexGroup);
const selectedIndex = computed(() =>
	indexGroup.value.find((index) => index.id === activeIndex.value)
);
const searchedCity = computed(() => store.getters.searchedCity);
const selectedDate = ref(new Date(route.query.date));

await getCityWeather(searchedCity.value);
updateSearchedCity(searchedCity.value);

const weatherData = computed(() =>
	getSelectedDateWeather(
		searchedCity.value?.weather?.hourly,
		selectedDate.value
	)
);

const sunrisesData = computed(() =>
	completeSunriseData(searchedCity.value?.weather?.sunrises)
);

// Get current time index (onlyif the date is today)
const currentTimeIndex = computed(() =>
	isToday(selectedDate.value) ? roundToHour(new Date()).getHours() : null
);

const getSelectedDate = (day) => {
	selectedDate.value = new Date(day);
};

// Get city weather
async function getCityWeather(data) {
	// If city is not subscribed  --> weather data in store/searchedCity
	if (data && data.adcode === route.query.adcode) return;
	else {
		// If page reload
		try {
			const weatherData = await store.dispatch('getWeatherData', {
				adcode: route.query.adcode,
			});
			let cityObj = {
				adcode: route.query.adcode,
				name: route.params.city,
			};
			cityObj.weather = weatherData;
			store.commit('setSearchedCity', cityObj);
		} catch (err) {
			console.error(err);
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SITUATION: Lack of hourly data and sunrise/sunset data (only 48 hours)
// SOLUTION: All hourly data we built for chart page according to SECOND DAY.

// Complete hourly weather of futher 10days
function completeHourlyData(data) {
	if (!data) return;

	// Get weather data of the second day
	const zeroTimeIndex = data.findIndex(
		(item) =>
			new Date(item.data_time).toDateString() ===
			getSecondDay().toDateString()
	);
	const secondDayWeather = data.slice(zeroTimeIndex, zeroTimeIndex + 24);

	// Complete data
	let hourlyWeather_10days = [];
	for (let i = 0; i < import.meta.env.VITE_FCST_DAYS; i++) {
		for (let j = 0; j < 24; j++) {
			hourlyWeather_10days.push({
				...secondDayWeather[j],
				data_time: new Date(
					newDate(i).setHours(j, 0, 0, 0)
				).toLocaleString('zh-CN'),
			});
		}
	}
	return hourlyWeather_10days;
}

// Complete sunrise/sunset data of futher 10 days
function completeSunriseData(data) {
	// Get sunrise/sunset data of the second day
	const sunriseSampleData = data.find(
		(item) =>
			new Date(item.data_time).toDateString() ===
			getSecondDay().toDateString()
	);

	// Complete data
	let sunriseData_10days = [];
	for (let i = 0; i < import.meta.env.VITE_FCST_DAYS; i++) {
		sunriseData_10days.push({
			...sunriseSampleData,
			data_time: new Date(
				new Date(newDate(i)).setHours(0, 0, 0, 0)
			).toLocaleDateString([]),
		});
	}
	return sunriseData_10days;
}

function updateSearchedCity(data) {
	if (!data || !data.weather) return;
	const { hourly } = data.weather;
	const weatherObj = {
		...data.weather,
		hourly: completeHourlyData(hourly),
	};
	store.commit('setSearchedCity', {
		...data,
		weather: weatherObj,
	});
}

function getSelectedDateWeather(data, date) {
	return data.filter(
		(item) =>
			new Date(item.data_time).toDateString() ===
			new Date(date).toDateString()
	);
}
</script>
