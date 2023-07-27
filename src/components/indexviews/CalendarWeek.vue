<template>
	<!-- Parent container for the calendar week -->
	<div class="max-w-screen-md">
		<!-- Calendar grid -->
		<div class="flex gap-8 overflow-x-scroll">
			<ul v-for="day in days" :key="day" class="list-none">
				<calendar-week-day-item
					:isToday="isToday(day)"
					:isSelectedDate="isSelectedDate(day)"
					:selectedDate="selectedDate"
					:day="day"
					@dateSelected="selectDate(day)"
				></calendar-week-day-item>
			</ul>
		</div>

		<!-- Calendar date indicator -->
		<calendar-date-indicator
			:selectedDate="selectedDate"
		></calendar-date-indicator>
	</div>
</template>

<script setup>
import CalendarWeekDayItem from '../calendar/CalendarWeekDayItem.vue';
import CalendarDateIndicator from '../calendar/CalendarDateIndicator.vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as config from '../../assets/js/config.js';

const emit = defineEmits(['dateSelected']);

const route = new useRoute();
const router = new useRouter();
const selectedDate = ref(new Date(route.query.date));
const today = new Date();

// ['day1','day2'...'day10']
const days = computed(() => {
	let daysArr = [];
	for (let i = 0; i < config.FCST_DAYS; i++) {
		daysArr.push(
			new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
		);
	}
	return daysArr;
});

const selectDate = (day) => {
	selectedDate.value = day;
	const query = Object.assign({}, route.query);
	delete query.date;
	router.push({
		query: { ...query, date: day },
	});
	emit('dateSelected', day);
};

const isToday = (day) => {
	if (
		new Date(today).setHours(0, 0, 0, 0) ===
		new Date(day).setHours(0, 0, 0, 0)
	)
		return true;
	return false;
};

const isSelectedDate = (day) => {
	if (
		new Date(selectedDate.value).setHours(0, 0, 0, 0) ===
		new Date(day).setHours(0, 0, 0, 0)
	)
		return true;
	return false;
};
</script>
