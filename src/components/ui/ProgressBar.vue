<template>
	<div class="progress-bar-container">
		<div
			class="progress-bar-indicator"
			:style="{
				width: indicatorWidth,
				left: indicatorLeft,
				'--width': barWidth,
				'--left': barLeft,
			}"
		></div>
	</div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
	indicatorWidth: { type: Number, required: true },
	indicatorLeft: { type: Number, required: true },
	barWidth: { type: Number, required: false },
	barLeft: { type: Number, required: false },
});

const indicatorWidth = computed(() => props.indicatorWidth * 100 + '%');

const indicatorLeft = computed(() => props.indicatorLeft * 100 + '%');

const barWidth = computed(() => (1 / props.indicatorWidth) * 100 + '%');

const barLeft = computed(
	() => (-1 / props.indicatorWidth) * props.indicatorLeft * 100 + '%'
);
</script>

<style scoped>
.progress-bar-container {
	position: relative;
	width: 100%;
	height: 0.5rem;
	background: #004e71;
	border-radius: 100px;
}

.progress-bar-indicator {
	position: absolute;
	border-radius: inherit;
	height: inherit;
	-webkit-mask: linear-gradient(#fff 0 0);
	mask: linear-gradient(#fff 0 0);
	top: 0;
}

.progress-bar-indicator::before {
	position: absolute;
	content: '';
	top: 0;
	left: var(--left);
	width: var(--width);
	bottom: 0;
	border-radius: inherit;
	background-image: linear-gradient(
		to right,
		#86efac 10%,
		#fef08a,
		#f9a252 90%
	);
}
</style>
