<template>
	<div class="flex flex-col gap-1 mb-4">
		<div class="text-5xl flex items-center whitespace-nowrap gap-2">
			<h2>{{ title_1 }}</h2>
			<h2 class="text-[#888]">{{ title_2 }}</h2>
		</div>
		<div class="text-xl text-[#888] w-full">
			<h3 class="whitespace-nowrap">{{ subtitle }}</h3>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title_1: { type: String, required: true },
	title_2: { type: String, required: false },
	subtitle: { type: String, required: true },
});
</script>
