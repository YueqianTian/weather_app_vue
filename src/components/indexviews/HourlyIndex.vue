<template>
	<div class="mb-8 max-w-screen-md relative">
		<div
			class="flex justify-between items-top transition-all"
			id="chart-header"
		>
			<chart-header
				:title_1="getTitles.title_1"
				:title_2="getTitles.title_2 ? getTitles.title_2 : ''"
				:subtitle="getTitles.subtitle"
			></chart-header>
			<IndexDropdown @index-selected="selectIndex" />
		</div>

		<div
			id="label_timestamp_el"
			class="absolute top-0 left-1/2 translate-x-[-50%] invisible"
		></div>

		<p v-if="!hasData">Loading...</p>
		<div
			v-else
			class="pr-8 rounded-2xl aspect-video border-solid border-2 border-[rgba(255,255,255,0.05)] overflow-hidden"
		>
			<component
				class="h-full"
				:is="selectedComponent"
				:weather-data="weatherData"
				:sunrises-data="
					activeIndex === 'temp_fc' || 'feels_like'
						? sunrisesData
						: null
				"
				:currentTimeIndex="currentTimeIndex"
				:active-index="activeIndex"
			></component>
		</div>
	</div>
</template>

<script>
import IndexDropdown from '../charts/IndexDropdown.vue';
import ChartHeader from '../charts/ChartHeader.vue';
import ChartOfHumidity from '../charts/ChartOfHumidity.vue';
import ChartOfTempAndFeelsLike from '../charts/ChartOfTempAndFeelsLike.vue';

export default {
	components: {
		IndexDropdown,
		ChartHeader,
		ChartOfHumidity,
		ChartOfTempAndFeelsLike,
	},
	data() {
		return {
			activeIndex: this.$route.params.index,
			titleStrategies: {
				temp_fc: (data, currWeather) => {
					const hourlyData_temp = data?.map((data) => data.temp_fc);
					const maxOfTemp = Math.max(...hourlyData_temp);
					const minOfTemp = Math.min(...hourlyData_temp);
					return currWeather
						? {
								title_1: `${currWeather.temp_fc}°`,
								subtitle: `最高${maxOfTemp}° 最低${minOfTemp}°`,
						  }
						: {
								title_1: `${maxOfTemp}°`,
								title_2: `${minOfTemp}°`,
								subtitle: `摄氏度（°C）`,
						  };
				},
				feels_like: (data, currWeather) => {
					const hourlyData_temp = data?.map((data) => data.temp_fc);
					const hourlyData_feelsLike = data?.map(
						(data) => data.feels_like
					);
					const maxOfTemp = Math.max(...hourlyData_temp);
					const minOfTemp = Math.min(...hourlyData_temp);
					const maxOfFeelsLike = Math.max(...hourlyData_feelsLike);
					const minOfFeelsLike = Math.min(...hourlyData_feelsLike);
					return currWeather
						? {
								title_1: `${currWeather.feels_like}°`,
								subtitle: `实际温度：${currWeather.temp_fc}°`,
						  }
						: {
								title_1: `${maxOfFeelsLike}°`,
								title_2: `${minOfFeelsLike}°`,
								subtitle: `实际温度：最高${maxOfTemp}° 最低${minOfTemp}°`,
						  };
				},
				rh: (data, currWeather) => {
					const hourlyData_rh = data?.map((data) => data.rh);
					const avgRh =
						hourlyData_rh.reduce((a, b) => a + b, 0) /
						hourlyData_rh.length;
					return currWeather
						? {
								title_1: `${currWeather.rh}%`,
								subtitle: `当前相对湿度`,
						  }
						: {
								title_1: `${Math.floor(avgRh)}%`,
								subtitle: `平均`,
						  };
				},
			},
		};
	},
	props: {
		activeDate: { type: Object, required: true },
		weatherData: { type: Object, required: true },
		sunrisesData: { type: Array, required: false },
		currentTimeIndex: { type: Number, required: false },
	},
	computed: {
		searchedCity() {
			return this.$store.getters.searchedCity;
		},
		hasData() {
			return this.searchedCity ? true : false;
		},
		selectedComponent() {
			if (this.activeIndex === 'rh') return ChartOfHumidity;
			if (this.activeIndex === 'temp_fc' || 'feels_like')
				return ChartOfTempAndFeelsLike;
		},
		currentWeather() {
			if (!this.currentTimeIndex) return;
			return this.weatherData.find(
				(item) =>
					new Date(item.data_time).getHours() ===
					this.currentTimeIndex
			);
		},
		getTitles() {
			return this.titleStrategies[this.activeIndex](
				this.weatherData,
				this.currentWeather
			);
		},
	},
	methods: {
		selectIndex(index) {
			this.activeIndex = index;
			const query = Object.assign({}, this.$route.query);

			this.$router.push({
				name: 'indexView',
				params: { index },
				query: query,
			});
		},
	},
};
</script>
