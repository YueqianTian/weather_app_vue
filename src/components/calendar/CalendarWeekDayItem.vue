<template>
	<li class="flex flex-col items-center gap-2 whitespace-nowrap">
		<span class="mb-4 px-2">
			{{ weekday }}
		</span>

		<span
			@click="selectDate"
			:class="{
				'calendar-day--selected-date': isSelectedDate,
				'calendar-day--today': isToday,
				'calendar-day--today-and-selected': isToday && isSelectedDate,
			}"
			class="cursor-pointer w-max aspect-square text-center text-xl p-2"
		>
			{{ day }}
		</span>
	</li>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	day: {
		type: Object,
		required: true,
	},
	selectedDate: {
		type: Object,
		required: true,
	},
	isToday: {
		type: Boolean,
		default: true,
	},
	isSelectedDate: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['dateSelected']);

const selectDate = () => {
	let newSelectedDate = new Date(props.selectedDate);
	emit('dateSelected', newSelectedDate);
};

const weekday = computed(() => {
	return new Date(props.day).toLocaleDateString('zh-CN', {
		weekday: 'short',
	});
});

const day = computed(() => {
	return new Date(props.day)
		.toLocaleDateString('zh-CN', {
			day: 'numeric',
		})
		.replace('日', '');
});
</script>

<style scoped>
.calendar-day--selected-date {
	color: #222;
	border-radius: 50px;
	background: #ddd;
	width: max-content;
	text-align: center;
}

.calendar-day--today {
	color: rgb(0, 190, 255);
}

.calendar-day--today-and-selected {
	color: #222;
	background: rgb(0, 190, 255);
	width: max-content;
}
</style>
