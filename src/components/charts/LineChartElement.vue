<template>
	<div>
		<Line
			:data="chartData"
			:options="chartOptions"
			:plugins="customPlugins"
		/>
	</div>
</template>

<script>
import { Line } from 'vue-chartjs';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	TimeScale,
} from 'chart.js';
import 'chartjs-adapter-luxon';

export default {
	components: { Line },
	data() {
		return {
			defaultOptions: {
				responsive: true,
				maintainAspectRatio: false,
				animation: false,
			},
		};
	},
	props: {
		chartData: { type: Object },
		customOptions: { type: Object },
		customPlugins: { type: Array },
		currentTimeIndex: { type: Number },
	},
	computed: {
		chartOptions() {
			return { ...this.defaultOptions, ...this.customOptions };
		},
	},
	setup() {
		// PLUGIN: show tooltip line on hover
		const tooltipLine = {
			id: 'tooltipLine',
			afterInit(chart) {
				chart.tooltipLine = {};
			},
			afterEvent(chart, args) {
				const { inChartArea } = args;
				const { x } = args.event;
				chart.tooltipLine = { draw: inChartArea, x };

				chart.draw();
			},
			beforeDraw(chart) {
				const { draw, x } = chart.tooltipLine;
				const { ctx } = chart;
				const { bottom } = chart.chartArea;
				ctx.save();

				if (!draw) return;
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, bottom);
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#fff';
				ctx.stroke();
				ctx.restore();
			},
		};

		ChartJS.register(
			CategoryScale,
			LinearScale,
			PointElement,
			LineElement,
			Title,
			Tooltip,
			Legend,
			Filler,
			TimeScale,
			tooltipLine
		);
		// Setting globally
		ChartJS.defaults.font.size = 16;
		ChartJS.defaults.color = '#888';
		ChartJS.defaults.animation.delay = 100;
		ChartJS.defaults.layout.autoPadding = false;
	},
};
</script>
