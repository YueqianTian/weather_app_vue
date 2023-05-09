<template>
	<Teleport to="body">
		<Transition name="modal-overlay">
			<div
				v-show="modalActive"
				class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8"
			>
				<Transition name="modal-inner">
					<div
						v-if="modalActive"
						class="p-4 pt-8 bg-white self-start mt-32 max-w-screen-md"
					>
						<slot></slot>
						<button
							@click="$emit('close-modal')"
							class="text-white mt-6 py-2 px-6 bg-weather-primary"
						>
							关闭
						</button>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
defineEmits(['close-modal']);
defineProps({
	modalActive: {
		type: Boolean,
		default: false,
	},
});
</script>

<style scoped>
.modal-overlay-enter-from,
.modal-overlay-leave-active {
	opacity: 0;
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
	transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
	transform: scale(0.8s);
}

.modal-inner-enter-active {
	/* .15s delay */
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-to {
	opacity: 0;
}
</style>
