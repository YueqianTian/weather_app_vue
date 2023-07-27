<template>
	<LineChartElement
		:chart-data="chartData"
		:custom-options="customOptions"
		:custom-plugins="customPlugins"
	/>
</template>

<script>
import LineChartElement from './LineChartElement.vue';
import { getIconUrl } from '../../assets/js/getIconUrl.js';
import {
	getGradient,
	externalTooltipHandler,
	getParsedData,
	tempPalette,
	selectTempStrategies,
} from './ChartActions.js';

export default {
	components: { LineChartElement },
	data() {
		return {
			palette: [
				{
					hex: '#fff',
					rgba1: 'rgba(255,255,255,.1)',
					rgba2: 'rgba(255,255,255,.2)',
				},
				{
					hex: '#282828',
					rgba: 'rgba(40,40,40,.25)',
				},
			],
		};
	},
	props: {
		weatherData: {
			type: Object,
			required: true,
		},
		sunrisesData: {
			type: Array,
			required: true,
		},
		currentTimeIndex: {
			type: Number,
			required: false,
		},
		activeIndex: {
			type: String,
			required: true,
		},
	},
	computed: {
		hourlyData_10days_high() {
			return this.$store.getters.searchedCity?.weather?.daily?.map(
				(data) => data.high
			);
		},
		hourlyData_10days_low() {
			return this.$store.getters.searchedCity?.weather?.daily?.map(
				(data) => data.low
			);
		},
		maxOfFuther10days() {
			return Math.max(...this.hourlyData_10days_high);
		},
		minOfFuther10days() {
			return Math.min(...this.hourlyData_10days_low);
		},
		data() {
			return getParsedData(this.weatherData, this.activeIndex);
		},
		yAxis() {
			return this.data.map((item) => item.y);
		},
		maxIndex() {
			return this.yAxis.findIndex(
				(item) => item === Math.max(...this.yAxis)
			);
		},
		minIndex() {
			return this.yAxis.findIndex(
				(item) => item === Math.min(...this.yAxis)
			);
		},
		chartData() {
			return {
				datasets: [
					{
						data: this.data,
						backgroundColor: (context) => {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) return;
							const gradient = getGradient(ctx, chartArea);

							const [minIndex, maxIndex] = selectTempStrategies(
								this.minOfFuther10days,
								this.maxOfFuther10days
							);
							for (let i = 0; i < maxIndex - minIndex + 1; i++) {
								gradient.addColorStop(
									i / (maxIndex - minIndex),
									tempPalette[minIndex + i].rgba
								);
							}
							return gradient;
						},
						borderColor: (context) => {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) return;
							const gradient = getGradient(ctx, chartArea);

							const [minIndex, maxIndex] = selectTempStrategies(
								this.minOfFuther10days,
								this.maxOfFuther10days
							);

							for (let i = 0; i < maxIndex - minIndex + 1; i++) {
								gradient.addColorStop(
									i / (maxIndex - minIndex),
									tempPalette[minIndex + i].hex
								);
							}
							return gradient;
						},
						borderWidth: 8,
						pointBorderColor: '#181818',
						hoverBackgroundColor: this.palette[0].hex,
						pointRadius: 6,
						pointBorderWidth: (context) => {
							let value = context.dataset.data[context.dataIndex];
							let index = new Date(value.x).getHours();
							return index === this.currentTimeIndex ||
								index === this.minIndex ||
								index === this.maxIndex
								? 5
								: 0;
						},
						pointBackgroundColor: (context) => {
							let value = context.dataset.data[context.dataIndex];
							let index = new Date(value.x).getHours();
							return index === this.currentTimeIndex
								? '#fff'
								: 'rgba(0,0,0,0)';
						},
						tension: 0.4,
						fill: true,
						spanGaps: true,
					},
				],
			};
		},
		customOptions() {
			return {
				layout: {
					padding: { top: 40, bottom: 15 },
				},
				hoverRadius: 12,
				hoverBorderWidth: 2,
				interaction: {
					intersect: false,
					mode: 'index',
					axis: 'x',
				},
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						enabled: false,
						position: 'nearest',
						external: externalTooltipHandler,
						callbacks: {
							label(tooltipItem) {
								const value = tooltipItem.formattedValue + '°';
								return value;
							},
						},
					},
				},
				scales: {
					x: {
						type: 'time',
						time: {
							// 	 Luxon format string
							tooltipFormat: 'H 时', //'HH:mm',
							displayFormats: {
								hour: 'H 时',
							},
						},
						display: true,
						position: 'bottom',
						border: {
							dash: [3, 3],
						},
						ticks: {
							autoSkip: true,
							maxRotation: 0,
							align: 'start',
							stepSize: 6,
						},
						grid: {
							color: this.palette[0].rgba1,
						},
					},
					x1: {
						display: true,
						position: 'top',
						grid: {
							display: false,
						},
						ticks: {
							display: false,
							align: 'center',
						},
					},
					y: {
						suggestedMin: this.minOfFuther10days,
						suggestedMax: this.maxOfFuther10days,
						position: 'right',
						ticks: {
							stepSize: 3,
							callback: (value) => {
								return value + '°';
							},
						},
						grace: '10%',
						grid: {
							color: this.palette[0].rgba1,
						},
					},
				},
			};
		},
		// PLUGIN: show max and min labels
		showMaxAndMinLabels() {
			return {
				id: 'showMaxAndMinLabels',
				beforeDraw: (chart) => {
					const { ctx } = chart;
					ctx.save();

					// show point labels of max and min
					ctx.fillStyle = '#bbb';
					const textWidth = ctx.measureText('最高').width;

					ctx.fillText(
						'最高',
						chart.getDatasetMeta(0).data[this.maxIndex]?.x -
							textWidth / 2,
						chart.getDatasetMeta(0).data[this.maxIndex]?.y - 12
					);

					ctx.fillText(
						'最低',
						chart.getDatasetMeta(0).data[this.minIndex]?.x -
							textWidth / 2,
						chart.getDatasetMeta(0).data[this.minIndex]?.y - 12
					);
					ctx.restore();
				},
			};
		},
		// PLUGIN: Get icon on x axis
		labellingIconOnXAxis() {
			return {
				id: 'labellingIconOnXAxis',
				afterDraw: (chart) => {
					const { ctx } = chart;
					const datasets = chart.data.datasets[0];
					const { data } = datasets;
					for (let i = 0; i < data?.length; i++) {
						if ((i + 1) % 2 === 0) {
							const pointEl = chart.getDatasetMeta(0).data[i];
							let image = new Image();
							image.src = getIconUrl(
								{
									sunrisesData: this.sunrisesData,
									weatherData: this.weatherData[i],
								},
								true
							);
							ctx.drawImage(image, pointEl.x - 20, 0, 40, 40);
						}
					}
				},
			};
		},
		// PLUGIN: show line of current time
		showCurrentTime() {
			return {
				id: 'showCurrentTime',
				beforeDraw: (chart) => {
					if (!this.currentTimeIndex) return;
					const {
						ctx,
						canvas: {
							clientLeft: left,
							clientTop: top,
							clientHeight: height,
						},
					} = chart;
					const x =
						chart.getDatasetMeta(0).data[this.currentTimeIndex]?.x;
					ctx.save();

					// fill regtangle for past time
					ctx.fillStyle = this.palette[1].rgba; // TODO
					ctx.lineWidth = 1;
					ctx.fillRect(left, top, x, height);
					ctx.restore();

					// draw line for current time
					ctx.beginPath();
					ctx.moveTo(x, 0);
					ctx.lineTo(x, height);
					ctx.strokeStyle = this.palette[0].rgba2;
					ctx.stroke();
					ctx.restore();
				},
			};
		},
		customPlugins() {
			return [
				this.labellingIconOnXAxis,
				this.showCurrentTime,
				this.showMaxAndMinLabels,
			];
		},
	},
};
</script>
