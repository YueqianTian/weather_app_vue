<template>
	<base-container>
		<div class="aspect-[2/1] h-full flex flex-col">
			<div class="flex gap-2 items-baseline">
				<slot name="icon"></slot>
				<h2 class="mb-6">{{ title }}</h2>
			</div>
			<h3 class="text-6xl mb-8">{{ subtitle }}</h3>
			<p class="mt-auto">{{ description }}</p>
		</div>
	</base-container>
</template>

<script setup>
import BaseContainer from '../ui/BaseContainer.vue';

defineProps({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
});
</script>
