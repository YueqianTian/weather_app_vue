<template>
	<div class="flex flex-col flex-1">
		<!-- Overview -->
		<div class="flex flex-col items-center py-12">
			<AnimatedPlaceholder class="max-w-[300px] w-full mb-2" />
			<AnimatedPlaceholder class="max-w-[300px] w-full h-[100px] mb-6" />
			<AnimatedPlaceholder class="max-w-[300px] w-full" />
			<AnimatedPlaceholder class="max-w-[300px] w-full" />
		</div>

		<!-- Hourly -->
		<div class="flex flex-col items-center py-12 mx-8">
			<AnimatedPlaceholder
				class="max-w-screen-md h-[100px] w-full mb-12"
			/>
		</div>

		<!-- Daily -->
		<div class="flex flex-col items-center py-12 mx-8">
			<AnimatedPlaceholder
				class="max-w-screen-md h-[100px] w-full mb-12"
			/>
		</div>
	</div>
</template>

<script setup>
import AnimatedPlaceholder from '../ui/AnimatedPlaceholder.vue';
</script>
