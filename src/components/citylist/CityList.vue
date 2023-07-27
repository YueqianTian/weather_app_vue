<template>
	<div v-if="!hasError">
		<div v-for="city in savedCities" :key="city.id">
			<city-card :city="city" @click="goToCityView(city)"></city-card>
		</div>
	</div>

	<p v-if="savedCities.length === 0" class="mt-[-.5rem]">
		还未添加地理位置。在上方输入栏搜索区域关键词，即刻订阅天气预报。
	</p>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import CityCard from './CityCard.vue';
import { ref, computed } from 'vue';

const router = useRouter();
const store = new useStore();
const savedCities = computed(() => store.getters.savedCities);
const hasError = ref(false);

const loadCityWeather = async () => {
	store.dispatch('getSavedCities');

	if (savedCities.value.length === 0) return;

	savedCities.value.forEach(async (city, index) => {
		try {
			savedCities.value[index].weather = await store.dispatch(
				'getWeatherData',
				{
					adcode: city.adcode,
				}
			);
		} catch (err) {
			console.log(err.message);
			hasError.value = true;
		}
	});

	// Flicker delay
	await new Promise((res) => setTimeout(res, 500));
};

await loadCityWeather();

const goToCityView = (selectedCity) => {
	router.push({
		name: 'cityView',
		params: { city: selectedCity.name },
		query: {
			adcode: selectedCity.adcode,
			id: selectedCity.id,
		},
	});
};
</script>
