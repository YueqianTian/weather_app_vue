<template>
	<!-- index introduction in overview -->
	<IndexIntroElement
		:caption="selectedIndex.overview?.caption"
		:description="
			getOverview(selectedIndex.id, [
				weatherData,
				currentWeather,
				activeDate,
			])
		"
	/>

	<!-- index introduction in details -->
	<ul
		class="list-none"
		v-if="selectedIndex.details && selectedIndex.details.length > 0"
	>
		<IndexIntroElement
			v-for="index in selectedIndex.details"
			:key="index"
			:caption="`关于${index.caption}`"
			:description="index.description"
		/>
	</ul>
</template>

<script setup>
import { computed } from 'vue';
import IndexIntroElement from './IndexIntroElement.vue';

const props = defineProps({
	activeDate: { type: Object, required: true },
	weatherData: { type: Object, required: true },
	selectedIndex: { type: Object, required: true },
	currentTimeIndex: { type: Number, required: false },
});

// Get current weather (onlyif the date is today)
const currentWeather = computed(() => {
	if (!props.currentTimeIndex) return;
	return props.weatherData.find(
		(item) => new Date(item.data_time).getHours() === props.currentTimeIndex
	);
});

function getOverview(index, data) {
	return dailyOverviewStrategies[index](...data);
}

const dateOptions = { weekday: 'long' };
const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit' };

function localeDate(date) {
	return new Date(date).toLocaleDateString('zh-CN', dateOptions);
}
function localeTime(date) {
	return new Date(date).toLocaleTimeString([], timeOptions);
}
function addHours(date) {
	return new Date(date).setHours(new Date(date).getHours() + 1);
}

const dailyOverviewStrategies = {
	rh: (data, currWeather, date) => {
		// `今天，平均湿度为74%。`
		// '星期五，平均湿度将为69%。',
		const hourlyData_rh = data?.map((data) => data.rh);
		const avgRh =
			hourlyData_rh.reduce((a, b) => a + b, 0) / hourlyData_rh.length;

		return currWeather
			? `今天，平均湿度为${Math.floor(avgRh)}%。`
			: `${localeDate(date)}，平均湿度将为${Math.floor(avgRh)}%。`;
	},
	temp_fc: (data, currWeather, date) => {
		// today: '现在30°，多云。23:00左右预计有雨。今天的气温范围为28至35。'
		// not today	'星期五的最低气温将在04:00至05:00降至22，最高气温将在14:00至15:00升至33。',
		const hourlyData_temp = data?.map((data) => data.temp_fc);
		const maxOfTemp = Math.max(...hourlyData_temp);
		const minOfTemp = Math.min(...hourlyData_temp);
		const maxTime = data.find(
			(item) => item.temp_fc === maxOfTemp
		)?.data_time;
		const minTime = data.find(
			(item) => item.temp_fc === minOfTemp
		)?.data_time;
		const rainOrSnow = data.find(
			(item) => item.text.includes('雨') || item.text.includes('雪')
		);
		const forecastText_rainOrSnow = rainOrSnow
			? localeTime(rainOrSnow.data_time) +
			  '左右预计有' +
			  rainOrSnow.text +
			  '。'
			: '';

		return currWeather
			? `现在${currWeather.temp_fc}°，${currWeather.text}。${forecastText_rainOrSnow}今天的气温范围为${minOfTemp}°至${maxOfTemp}°。`
			: `${localeDate(date)}的最低气温将在${localeTime(
					minTime
			  )}至${localeTime(
					addHours(minTime)
			  )}降至${minOfTemp}°，最高气温将在${localeTime(
					maxTime
			  )}至${localeTime(addHours(maxTime))}升至${maxOfTemp}°。`;
	},
	feels_like: (data, currWeather, date) => {
		// '当前的体感温度为33,但实际温度为31。潮湿使人感觉更暖和。今天的体感温度范围为23至33。',
		// ‘星期六，体感温度范围将为31至38。潮湿使人感觉比实际温度更热。’
		const hourlyData_feelsLike = data?.map((data) => data.feels_like);
		const maxOfFeelsLike = Math.max(...hourlyData_feelsLike);
		const minOfFeelsLike = Math.min(...hourlyData_feelsLike);

		return currWeather
			? `当前的体感温度为${currWeather.feels_like}°，但实际温度为${currWeather.temp_fc}°。潮湿使人感觉更暖和。今天的体感温度范围为${minOfFeelsLike}°至${maxOfFeelsLike}°。`
			: `${localeDate(
					date
			  )}，体感温度范围将为${minOfFeelsLike}°至${maxOfFeelsLike}°。潮湿使人感觉比实际温度更热。`;
	},
};
</script>
