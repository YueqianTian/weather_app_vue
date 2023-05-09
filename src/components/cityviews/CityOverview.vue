<template>
	<div class="flex flex-col items-center text-white py-12">
		<h1 class="text-4xl mb-4">{{ route.params.city }}</h1>

		<p class="text-8xl mb-6">
			{{ Math.round(hourlyWeather[0]?.temp_fc) }}&deg;
		</p>

		<div class="text-center text-xl">
			<p>{{ hourlyWeather[0]?.text }}</p>
			<div class="flex gap-2">
				<span>最高{{ Math.round(dailyWeather[0]?.high) }}&deg;</span>
				<span> 最低{{ Math.round(dailyWeather[0]?.low) }}&deg;</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const route = new useRoute();
const dailyWeather = inject('dailyWeather');
const hourlyWeather = inject('hourlyWeather');
</script>
