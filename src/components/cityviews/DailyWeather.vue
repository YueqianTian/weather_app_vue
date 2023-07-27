<template>
	<base-container class="max-w-screen-md">
		<div
			class="pb-4 border-b-[1px] border-white border-opacity-10 flex gap-2 items-baseline"
		>
			<i class="fa-solid fa-calendar-week text-lg"></i>
			<h2>10日天气预报</h2>
		</div>

		<ul
			v-for="dailyData in dailyWeather"
			:key="dailyData?.date"
			class="list-none border-b-[1px] border-white border-opacity-10 last:border-none"
		>
			<li @click="selectDate(dailyData?.date)">
				<div class="flex justify-between items-center gap-10">
					<div class="whitespace-nowrap">
						{{
							new Date(dailyData?.date).setHours(0, 0, 0, 0) ===
							new Date().setHours(0, 0, 0, 0)
								? '今天'
								: new Date(dailyData?.date).toLocaleDateString(
										'zh-CN',
										{
											weekday: 'short',
										}
								  )
						}}
					</div>
					<img
						class="w-auto h-[50px] object-cover brightness-200"
						:src="getIconUrl({ weatherData: dailyData })"
					/>
					<div
						class="flex flex-progressbar gap-2 justify-end items-center"
					>
						<p>{{ Math.round(dailyData?.low) }}&deg;</p>
						<progress-bar
							:indicatorWidth="indicatorWidth(dailyData)"
							:indicatorLeft="indicatorLeftFrom(dailyData)"
							:minTempIndex="minIndex"
							:maxTempIndex="maxIndex"
						></progress-bar>
						<p>{{ Math.round(dailyData?.high) }}&deg;</p>
					</div>
				</div>
			</li>
		</ul>
	</base-container>
</template>

<script setup>
import { inject } from 'vue';
import ProgressBar from '../ui/ProgressBar.vue';
import BaseContainer from '../ui/BaseContainer.vue';
import { getIconUrl } from '../../assets/js/getIconUrl';
import { selectTempStrategies } from '../charts/ChartActions.js';

const dailyWeather = inject('dailyWeather');

// Get selected date and pass to AsyncCityView.vue
const emit = defineEmits(['dateSelected']);
const selectDate = (day) => {
	emit('dateSelected', new Date(day));
};

//////////////////////////////////////////////////////
// Progress bar

// cal min temp of 10 days' forecasts
let lowTemps = [];
dailyWeather.forEach((day) => lowTemps.push(day.low));
const min = Math.min(...lowTemps);

// cal max temp of 10 days' forecasts
let highTemps = [];
dailyWeather.forEach((day) => highTemps.push(day.high));
const max = Math.max(...highTemps);

// cal where progress-bar-indicator start from left
const barIndicatorLeftFrom = (minTemp, maxTemp, dailyData) => {
	return (dailyData.low - minTemp) / (maxTemp - minTemp);
};

// cal width of progress-bar-indicator
const barIndicatorWidth = (minTemp, maxTemp, dailyData) => {
	return (dailyData.high - dailyData.low) / (maxTemp - minTemp);
};

// preset args
const indicatorLeftFrom = barIndicatorLeftFrom.bind(null, min, max);
const indicatorWidth = barIndicatorWidth.bind(null, min, max);

// get color levels for progress bar
const [minIndex, maxIndex] = selectTempStrategies(min, max);
</script>
