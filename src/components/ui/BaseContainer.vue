<template>
	<div class="rounded-lg text-white cursor-pointer w-full" :class="view">
		<slot> </slot>
	</div>
</template>

<script setup>
defineProps({
	view: {
		type: String,
		default: 'cityView',
		required: false,
	},
});
</script>

<style scoped>
.cityView {
	background-color: #004e71;
	padding: 2rem;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
		0 4px 6px -4px rgb(0 0 0 / 0.1);
	margin-bottom: 1rem;
}
.indexView {
	background-color: #282828;
	padding: 1rem 1.5rem;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
