<template>
	<main class="container text-white">
		<div class="pt-4 mb-4 relative">
			<input
				type="text"
				v-model.trim="searchQuery"
				@input="getSearchResults"
				placeholder="搜索省份 / 城市 / 地级区"
				class="py-2 px-1 w-full bg-transparent border-b focus:bg-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71] z-1"
			/>

			<!-- dropdown list -->
			<ul
				class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px] z-1"
				v-if="searchResults"
			>
				<p v-if="searchError">抱歉，查询失败，请再试一次。</p>
				<p v-else-if="!searchError && searchResults.length === 0">
					无法搜索出结果，请尝试其它关键词。
				</p>
				<template v-else>
					<li
						v-for="searchResult in searchResults"
						:key="searchResult.adcode"
						class="py-2 cursor-pointer"
						@click="previewCity(searchResult)"
					>
						{{ searchResult.name }}
					</li>
				</template>
			</ul>
		</div>

		<div class="flex flex-col gap-4">
			<Suspense>
				<city-list></city-list>
				<template #fallback>
					<CityCardSkeleton />
				</template>
			</Suspense>
		</div>
	</main>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import CityList from '../components/citylist/CityList.vue';
import { useStore } from 'vuex';
import CityCardSkeleton from '../components/citylist/CityCardSkeleton.vue';

const router = new useRouter();
const store = new useStore();
const searchQuery = ref('');
const searchError = ref(false);
const timeout = ref(null);
const timerInterval = null;
const searchResults = computed(() => store.getters.searchResults);

watch(searchResults, (_, oldValues) => {
	if (!oldValues || oldValues.length === 0) {
		searchQuery.value = '';
	}
});

// Preview result in drop-down list
const previewCity = (searchResult) => {
	const { adcode, name } = searchResult;
	router.push({
		name: 'cityView',
		params: { city: name },
		query: {
			adcode: adcode,
			preview: true,
		},
	});
	store.commit('setSearchResults', null);
};

const getSearchResults = () => {
	searchError.value = false;
	clearInterval(timerInterval);
	clearTimeout(timeout.value);

	timeout.value = setTimeout(async () => {
		if (searchQuery.value) {
			try {
				// 1. Request search results
				const responseData = await store.dispatch(
					'getCityData',
					searchQuery.value
				);
				// 2. Handle response data
				store.dispatch('handleCityData', responseData);
			} catch (error) {
				console.log(error.message);
			}
			return;
		}
		store.commit('setSearchResults', null);
	}, 300);
};
</script>
