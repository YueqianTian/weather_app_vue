<template>
	<li class="mb-6">
		<base-container view="indexView">
			<h3 class="text-2xl mb-2 font-medium">{{ caption }}</h3>
			<p class="whitespace-pre-line text-[#aaa] text-lg">
				{{ description }}
			</p>
		</base-container>
	</li>
</template>

<script setup>
import BaseContainer from '../ui/BaseContainer.vue';

const props = defineProps({
	caption: {
		required: false,
		type: String,
		default: '',
	},
	description: {
		required: true,
		type: String,
		default: '',
	},
});
</script>
