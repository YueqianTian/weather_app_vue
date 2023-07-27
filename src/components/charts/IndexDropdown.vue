<template>
	<div class="dropdown" @click="isOpen = !isOpen">
		<div class="option">
			<i
				class="fa-solid fa-temperature-half text-xl"
				v-if="activeIndex === 'feels_like' || activeIndex === 'temp_fc'"
			></i>
			<i class="fas fa-tint text-xl" v-if="activeIndex === 'rh'"></i>
			<button class="down-arrow">
				<i class="fa-solid fa-chevron-down"></i>
			</button>
		</div>

		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<div class="menu-list delay-100" v-if="isOpen">
				<div class="menu-item" @click="selectIndex('temp_fc')">
					<button
						:class="{ active: activeIndex === 'temp_fc' }"
						class="mr-2 opacity-0"
					>
						<i class="fa-solid fa-check"></i>
					</button>
					<span class="mr-auto">气温</span>
					<i class="fa-solid fa-temperature-half text-xl"></i>
				</div>

				<div class="menu-item" @click="selectIndex('feels_like')">
					<button
						:class="{ active: activeIndex === 'feels_like' }"
						class="mr-2 opacity-0"
					>
						<i class="fa-solid fa-check"></i>
					</button>
					<span class="mr-auto">体感温度</span>
					<i class="fa-solid fa-temperature-half text-xl"></i>
				</div>

				<div class="menu-item" @click="selectIndex('rh')">
					<button
						:class="{ active: activeIndex === 'rh' }"
						class="mr-2 opacity-0"
					>
						<i class="fa-solid fa-check"></i>
					</button>
					<span class="mr-auto">湿度</span>
					<i class="fas fa-tint text-xl"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = new useRoute();
const isOpen = ref(false);
const activeIndex = ref(route.params.index);
const emit = defineEmits(['indexSelected']);

const selectIndex = (index) => {
	activeIndex.value = index;
	emit('indexSelected', index);
};
</script>

<style scoped>
.dropdown {
	position: relative;
}
.option:hover,
.dropdown:hover .option {
	opacity: 40%;
}

.option {
	position: relative;
	border-radius: 100px;
	width: 5rem;
	height: 3rem;
	cursor: pointer;
	border: none;
	outline: none;
	background: #282828;
	margin-bottom: 0.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
}
/* .down-arrow { */
/* position: absolute; */
/* right: 1.2rem; */
/* top: 1rem; */
/* } */

.menu-list {
	position: absolute;
	right: 0;
	display: flex;
	flex-direction: column;
	width: 15rem;
	background: #282828;
	border-radius: 0.5rem;
	cursor: pointer;
	overflow: hidden;
	z-index: 10;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 0.5rem 0.8rem;
	width: 100%;
}
.menu-item:hover {
	background: rgba(255, 255, 255, 0.1);
}

.menu-item:not(:last-child) {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.active {
	opacity: 1;
}
</style>
