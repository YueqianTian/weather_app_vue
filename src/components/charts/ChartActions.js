let delayed;
import { DateTime } from 'luxon';

// Get new date - refer to : chartjs- Utils
export function newDate(days) {
	return DateTime.now().plus({ days }).toJSDate();
}

// Get date of tommorrow
export function getSecondDay() {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);
	return tomorrow;
}

export function getParsedData(dataArr, index) {
	let parsedData = [];
	dataArr.forEach((data) => {
		parsedData.push({
			x: new Date(data.data_time),
			y: data[index],
		});
	});
	return parsedData;
}

// generate linear gradient
export function createLinearGradient(ctx) {
	const canvas = ctx.chart.ctx;
	const gradient = canvas.createLinearGradient(0, 0, 0, 180);
	return gradient;
}

export function getGradient(ctx, chartArea) {
	let width, height, gradient;
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(
			0,
			chartArea.bottom,
			0,
			chartArea.top
		);
		return gradient;
	}
}

// round to hour
export function roundToHour(date) {
	const p = 60 * 60 * 1000; // milliseconds in an hour
	return new Date(Math.round(date.getTime() / p) * p);
}

export function isToday(day) {
	if (
		new Date(new Date()).setHours(0, 0, 0, 0) ===
		new Date(day).setHours(0, 0, 0, 0)
	)
		return true;
	return false;
}

// chart options - animation
export const animation = {
	onComplete() {
		delayed = true;
	},
	delay(ctx) {
		let delay = 0;
		if (ctx.type === 'data' && ctx.mode === 'default' && !delayed) {
			delay = ctx.dataIndex * 50 + ctx.datasetIndex * 100;
			return delay;
		}
	},
};

// External HTML Tooltip
// https://www.chartjs.org/docs/latest/samples/tooltip/html.html
function getOrCreateTooltip(chart) {
	let tooltipEl = chart.canvas.parentNode.querySelector('div');

	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.style.color = '#eee';
		tooltipEl.style.opacity = 1;
		tooltipEl.style.pointerEvents = 'none';
		tooltipEl.style.position = 'absolute';
		tooltipEl.style.transform = 'translate(-50%, 0)';
		tooltipEl.style.transition = 'all .1s ease';

		const tooltipBox = document.createElement('div');

		tooltipEl.appendChild(tooltipBox);
		chart.canvas.parentNode.appendChild(tooltipEl);
	}
	return tooltipEl;
}

export function externalTooltipHandler(context) {
	// Tooltip element
	const { chart, tooltip } = context;
	const tooltipEl = getOrCreateTooltip(chart);

	// Hide chart header if tooltip shows
	const chartHeader = document.getElementById('chart-header');
	chartHeader.style.visibility = tooltip.opacity === 0 ? 'visible' : 'hidden';

	// Set label of x axis
	if (tooltip) {
		const label_timestamp_el =
			document.getElementById('label_timestamp_el');
		label_timestamp_el.innerHTML = tooltip.dataPoints[0].label;
		label_timestamp_el.style.visibility =
			tooltip.opacity === 0 ? 'hidden' : 'visible';
	}

	// Hide tooltip if no tooltip
	if (tooltip.opacity === 0) {
		tooltipEl.style.opacity = 0;
		tooltipEl.style.transition = 'all  150ms  cubic-bezier(0.4, 0, 0.2, 1)';
		return;
	}

	// Set tooltip text
	if (tooltip.body) {
		// set label of y axis
		const bodyLines = tooltip.body.map((b) => b.lines);

		const label = document.createElement('div');
		bodyLines.forEach((body) => {
			// const colors = tooltip.labelColors[i];

			const span = document.createElement('span');
			const text = document.createTextNode(body);

			label.appendChild(span);
			span.appendChild(text);
		});

		const tooltipBox = tooltipEl.querySelector('div');

		// Remove old children
		while (tooltipBox.firstChild) {
			tooltipBox.firstChild.remove();
		}
		// Add new children
		tooltipBox.appendChild(label);
	}

	const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

	// Display, position, and set styles for font
	tooltipEl.style.opacity = 1;
	tooltipEl.style.left = positionX + tooltip.caretX + 'px';
	tooltipEl.style.top = positionY - 85 + 'px';
	tooltipEl.style.fontSize = '48px'; //tooltip.options.bodyFont.string;
}

// Color pallete for tempature and feels_like chart
export const tempPalette = [
	{ level: -55, hex: '#371a5e', rgba: 'rgba(55, 26, 94,.3)' },
	{ level: -35, hex: '#4c60e1', rgba: 'rgba(76, 96, 225,.3)' },
	{ level: -15, hex: '#045cc8', rgba: 'rgba(4, 92, 200,.3)' },
	{ level: -5, hex: '#1184fb', rgba: 'rgba(17, 132, 251,.3)' },
	{ level: 5, hex: '#4fbdfb', rgba: 'rgba(79, 189, 251,.3)' },
	{ level: 15, hex: '#63cfdd', rgba: 'rgba(99, 207, 221,.3)' },
	{ level: 25, hex: '#f1cc3b', rgba: 'rgba(241, 204, 59,.3)' },
	{ level: 35, hex: '#f07030', rgba: 'rgba(240, 112, 48,.3)' },
	{ level: 55, hex: '#ff3300', rgba: 'rgba(255, 51, 0,.3)' },
];

const tempArray = tempPalette.map((item) => item.level);

// Get index of color levels (e.g. -4 ~ 13 degree --> (palette index: 3 ~ 5 )(ie, level:-5, 5, 15) )
function tempColorStrategies(arr, minTemp, maxTemp) {
	const closestMinTemp = closest(arr, minTemp);
	const closestMaxTemp = closest(arr, maxTemp);

	const maxIndex =
		closestMaxTemp >= maxTemp || closestMaxTemp === Math.max(...arr)
			? findIndex(arr, closestMaxTemp)
			: findIndex(arr, closestMaxTemp) + 1;
	const minIndex =
		closestMinTemp <= minTemp || closestMinTemp === Math.min(...arr)
			? findIndex(arr, closestMinTemp)
			: findIndex(arr, closestMinTemp) - 1;

	return [minIndex, maxIndex];
}

function closest(arr, goal) {
	return arr.reduce(function (prev, curr) {
		return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
	});
}

function findIndex(arr, goal) {
	return arr.findIndex((i) => i === goal);
}
// https://stackoverflow.com/questions/8584902/get-the-closest-number-out-of-an-array

export const selectTempStrategies = tempColorStrategies.bind(null, tempArray);
