<template>
	<div class="max-w-screen-md w-full py-12">
		<div class="mx-8 text-white">
			<h2 class="mb-4">每小时天气预报</h2>
			<div class="flex gap-10 overflow-x-scroll">
				<ul
					v-for="hourlyData in hourlyWeather"
					:key="hourlyData?.data_time"
					class="flex flex-col gap-4 items-center list-none whitespace-nowrap"
				>
					<li class="text-md">
						{{
							new Date(hourlyData?.data_time).toLocaleTimeString(
								'zh-CN',
								{
									hour: 'numeric',
								}
							)
						}}
					</li>

					<img
						class="min-w-max h-[50px] object-cover brightness-200"
						:src="getIconUrl(hourlyData, true)"
					/>
					<li class="text-xl">
						{{ Math.round(hourlyData?.temp_fc) }}&deg;
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { inject } from 'vue';

const hourlyWeather = inject('hourlyWeather');
const getIconUrl = inject('getIconUrl');
</script>
