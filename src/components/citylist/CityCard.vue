<template>
	<div
		class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer"
	>
		<div class="flex flex-col flex-1 gap-2">
			<h2 class="text-3xl">{{ city?.city }}</h2>

			<p>{{ city?.weather?.hourly[0].text }}</p>
		</div>

		<div class="flex flex-col gap-2 items-end flex-1">
			<p class="text-3xl">
				{{ Math.round(city?.weather?.hourly[0].temp_fc) }}&deg;
			</p>
			<div class="flex gap-2">
				<span
					>最高{{ Math.round(city?.weather?.daily[0].high) }}&deg;
				</span>
				<span
					>最低{{
						Math.round(city?.weather?.daily[0].low)
					}}&deg;</span
				>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	city: {
		type: Object,
		default: () => {},
	},
});
</script>
