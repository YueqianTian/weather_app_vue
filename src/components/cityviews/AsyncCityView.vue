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
		<city-overview></city-overview>

		<hr class="border-white border-opacity-10 border w-full" />

		<!-- Hourly Weather  -->
		<hourly-weather></hourly-weather>

		<hr class="border-white border-opacity-10 border w-full" />

		<!-- Daily Weather -->
		<daily-weather></daily-weather>

		<div
			class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
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
import { provide, computed } from 'vue';
import CityOverview from './CityOverview.vue';
import HourlyWeather from './HourlyWeather.vue';
import DailyWeather from './DailyWeather.vue';
import icons from '../../assets/json/iconCodeConversion.json';

const route = new useRoute();
const router = new useRouter();
const store = new useStore();
const adcode = route.query.adcode;
const savedCities = computed(() => store.getters.savedCities);
let weatherData;

// Get city weather
const selectedCityWeather = async () => {
	const selectedCity = savedCities.value?.find(
		(city) => city?.adcode === adcode
	);
	if (selectedCity) {
		weatherData = selectedCity.weather;
	} else {
		try {
			weatherData = await store.dispatch('getWeatherData', {
				adcode: adcode,
			});

			// Flicker delay
			await new Promise((res) => setTimeout(res, 500));
		} catch (err) {
			console.error(err);
		}
	}
};
await selectedCityWeather();

// Remove city
const removeCity = () => {
	const updatedCities = savedCities.value.filter(
		(city) => city.id !== route.query.id
	);

	store.commit('setCities', updatedCities);

	store.commit('deleteWeather');

	store.dispatch('storeSavedCities', updatedCities);

	router.push({ name: 'home' });
};

///////////////////////////////////////////////////////////////////
// Get icon url
function getIconUrl(data, isHourlyWeather = false) {
	// get icon code
	const selectedIcon = icons.find(
		(icon) => icon.code === (isHourlyWeather ? data.code : data.code_day)
	);
	// Hourly Weather
	if (isHourlyWeather) {
		const isNighttime = isDaytimeOrNighttime(data.data_time);
		return iconcodeConvertedToUrl(selectedIcon.icon__code, isNighttime);
	}
	// Daily Weather
	else {
		return iconcodeConvertedToUrl(selectedIcon.icon__code, isHourlyWeather);
	}
}

function iconcodeConvertedToUrl(iconcode, n) {
	// load = false, +load = 0
	// load = true, +load = 1
	const code = iconcode.length > 1 ? iconcode[+n] : iconcode;

	return new URL(`../../assets/icon/icon__${code}.png`, import.meta.url).href;
}

function isDaytimeOrNighttime(hour) {
	const sunriseData = weatherData.sunrises;
	const hourTimestamp = new Date(hour).getTime();
	let isNighttime = true;

	sunriseData.forEach((day) => {
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
}

provide('hourlyWeather', weatherData?.hourly);
provide('dailyWeather', weatherData?.daily);
provide('getIconUrl', getIconUrl);
</script>
