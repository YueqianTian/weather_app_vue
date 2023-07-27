<template>
	<LineChartElement
		:chart-data="chartData"
		:custom-options="customOptions"
		:custom-plugins="[showCurrentTime]"
	/>
</template>

<script>
import LineChartElement from './LineChartElement.vue';
import {
	getGradient,
	externalTooltipHandler,
	getParsedData,
} from './ChartActions.js';

export default {
	components: { LineChartElement },
	data() {
		return {
			palette: [
				{
					hex: '#fff',
					rgba1: 'rgba(255,255,255,.05)',
					rgba2: 'rgba(255,255,255,.25)',
				},
				{
					hex: '#282828',
					rgba: 'rgba(40,40,40,.25)',
				},
				{
					hex: '#1f4c26',
					rgba: 'rgba(31, 76, 38, 0.4)',
				},
				{
					hex: '#1b90fb',
					rgba: 'rgba(27, 144, 251,.4)',
				},
				{
					hex: '#0700b8',
					rgba: 'rgba(7, 0, 194,.4)',
				},
				// {
				// 	hex: '#282828',
				// 	rgba: 'rgba(40,40,40,.25)',
				// },
			],
		};
	},
	props: {
		weatherData: {
			type: Object,
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
		chartData() {
			return {
				datasets: [
					{
						data: getParsedData(this.weatherData, this.activeIndex),
						backgroundColor: (context) => {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) return;
							const gradient = getGradient(ctx, chartArea);
							gradient.addColorStop(0, this.palette[2].rgba);
							gradient.addColorStop(0.5, this.palette[3].rgba);
							gradient.addColorStop(1, this.palette[4].rgba);
							return gradient;
						},
						borderColor: (context) => {
							const chart = context.chart;
							const { ctx, chartArea } = chart;
							if (!chartArea) return;
							const gradient = getGradient(ctx, chartArea);
							gradient.addColorStop(0, this.palette[2].hex);
							gradient.addColorStop(0.5, this.palette[3].hex);
							gradient.addColorStop(1, this.palette[4].hex);
							return gradient;
						},
						borderWidth: 8,
						pointBorderColor: '#181818',
						pointRadius: 6,
						hoverBackgroundColor: this.palette[0].hex,
						pointBorderWidth: (context) => {
							let value = context.dataset.data[context.dataIndex];
							let index = new Date(value.x).getHours();
							return index === this.currentTimeIndex ? 5 : 0;
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
					padding: { top: 15, bottom: 15 },
				},
				hoverRadius: 12,
				hoverRadiusWidth: 2,
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
								const value = tooltipItem.formattedValue + '%';
								return value;
							},
						},
					},
				},
				scales: {
					x: {
						type: 'time',
						time: {
							// 	Luxon format string
							tooltipFormat: 'H 时', // 'HH:mm'
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
						labels: getParsedData(
							this.weatherData,
							this.activeIndex
						).map((data) => data.y),
						ticks: {
							callback: function (value, index, ticks) {
								if ((index + 3) % 6 === 0)
									return this.getLabelForValue(index) + '%';
							},
							align: 'center',
						},
					},
					y: {
						beginAtZero: true,
						position: 'right',
						ticks: {
							stepSize: 20,
							callback: (value) => {
								return value + '%';
							},
							max: 100,
						},
						grid: {
							color: this.palette[0].rgba1,
						},
					},
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
					ctx.fillStyle = this.palette[1].rgba;
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
	},
};
</script>
