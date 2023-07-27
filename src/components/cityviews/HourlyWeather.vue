<template>
	<base-container class="max-w-screen-md">
		<div
			class="pb-4 border-b-[1px] border-white border-opacity-10 mb-4 flex gap-2 items-baseline"
		>
			<i class="fa-regular fa-clock text-lg"></i>
			<h2>每小时天气预报</h2>
		</div>

		<div class="flex gap-10 overflow-x-scroll">
			<ul
				v-for="hourlyData in hourlyWeather"
				:key="hourlyData?.data_time"
				class="list-none"
			>
				<li class="flex flex-col gap-4 items-center whitespace-nowrap">
					<div class="text-md">
						{{
							new Date(hourlyData?.data_time).toLocaleTimeString(
								'zh-CN',
								{
									hour: 'numeric',
								}
							)
						}}
					</div>

					<img
						class="w-max h-[50px] object-cover brightness-200"
						:src="
							getIconUrl(
								{ weatherData: hourlyData, sunrisesData },
								true
							)
						"
					/>

					<div class="text-xl">
						{{ Math.round(hourlyData?.temp_fc) }}&deg;
					</div>
				</li>
			</ul>
		</div>
	</base-container>
</template>

<script setup>
import { inject } from 'vue';
import BaseContainer from '../ui/BaseContainer.vue';
import { getIconUrl } from '../../assets/js/getIconUrl';

const hourlyWeather = inject('hourlyWeather').slice(0, 24);
const sunrisesData = inject('sunrisesData');
</script>
