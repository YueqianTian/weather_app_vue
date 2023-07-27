<template>
	<index-element
		:title="title"
		:subtitle="subtitle"
		:description="description"
	>
		<template #icon>
			<i class="fas fa-tint text-xl"></i>
		</template>
	</index-element>
</template>

<script setup>
import IndexElement from './IndexElement.vue';
import { inject, computed, ref } from 'vue';

const hourlyWeather = inject('hourlyWeather');
const dailyWeather = inject('dailyWeather');

const title = ref('湿度');
const subtitle = computed(() => `${hourlyWeather[0]?.rh}%`);
const description = computed(() => `目前露点温度为${dailyWeather[0]?.pop}°。`);
</script>
