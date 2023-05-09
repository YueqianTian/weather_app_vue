<template>
	<div>
		<Suspense>
			<async-city-view></async-city-view>
			<template #fallback>
				<CityViewSkeleton />
			</template>
		</Suspense>
	</div>
</template>

<script setup>
import AsyncCityView from '../components/cityviews/AsyncCityView.vue';
import CityViewSkeleton from '../components/cityviews/CityViewSkeleton.vue';
</script>
