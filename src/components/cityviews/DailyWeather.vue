<template>
	<div class="max-w-screen-md w-full py-12">
		<div class="mx-8 text-white">
			<h2 class="mb-4">10日天气预报</h2>
			<ul
				v-for="dailyData in dailyWeather"
				:key="dailyData?.date"
				class="flex justify-between items-center list-none gap-10"
			>
				<li class="whitespace-nowrap">
					{{
						new Date(dailyData?.date).setHours(0, 0, 0, 0) ===
						new Date().setHours(0, 0, 0, 0)
							? '今天'
							: new Date(dailyData?.date).toLocaleDateString(
									'zh-CN',
									{ weekday: 'short' }
							  )
					}}
				</li>
				<img
					class="w-auto h-[50px] object-cover brightness-200"
					:src="getIconUrl(dailyData)"
				/>
				<li
					class="flex flex-progressbar gap-2 justify-end items-center"
				>
					<p>{{ Math.round(dailyData?.low) }}&deg;</p>
					<progress-bar
						:indicatorWidth="indicatorWidth(dailyData)"
						:indicatorLeft="indicatorLeftFrom(dailyData)"
					></progress-bar>
					<p>{{ Math.round(dailyData?.high) }}&deg;</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { inject } from 'vue';
import ProgressBar from '../ui/ProgressBar.vue';

const getIconUrl = inject('getIconUrl');
const dailyWeather = inject('dailyWeather');

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
</script>
