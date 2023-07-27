<template>
	<div class="mt-4 self-center text-lg w-full text-center">
		<span> {{ date }}</span>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	selectedDate: {
		type: Object,
		required: true,
	},
	date: {
		type: String,
		required: false,
	},
});

const year = computed(() => {
	return new Date(props.selectedDate).toLocaleDateString('zh-CN', {
		year: 'numeric',
	});
});

const month = computed(() => {
	return new Date(props.selectedDate).toLocaleDateString('zh-CN', {
		month: 'numeric',
	});
});

const day = computed(() => {
	return new Date(props.selectedDate).toLocaleDateString('zh-CN', {
		day: 'numeric',
	});
});

const weekday = computed(() => {
	return new Date(props.selectedDate).toLocaleDateString('zh-CN', {
		weekday: 'long',
	});
});

const date = computed(() => {
	return year.value + month.value + day.value + '  ' + weekday.value;
});
</script>
