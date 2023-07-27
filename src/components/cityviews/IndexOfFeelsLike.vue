<template>
	<index-element :title="title" :subtitle="subtitle" :description="description">
		<template #icon>
			<i class="fa-solid fa-temperature-half text-xl"></i>
		</template>
	</index-element>
</template>

<script setup>
import IndexElement from './IndexElement.vue';
import { inject, computed, ref } from 'vue';

const hourlyWeather = inject('hourlyWeather');

const title = ref('体感温度');
const subtitle = computed(() => `${hourlyWeather[0]?.feels_like}°`);
const description = computed(() => `潮湿使人感觉更热。`);
</script>
