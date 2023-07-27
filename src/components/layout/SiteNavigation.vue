<template>
	<header class="sticky top-0 bg-weather-primary shadow-lg z-10">
		<nav
			class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6 justify-between"
		>
			<router-link :to="{ name: 'home' }">
				<div class="flex items-center gap-3">
					<i class="fa-solid fa-sun text-2xl"></i>
					<p class="text-2xl">天气</p>
				</div>
			</router-link>

			<div class="flex gap-3">
				<i
					@click="toggleModal"
					class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"
				></i>
				<i
					class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"
					@click="addCity"
					v-if="route.query.preview"
				></i>
			</div>

			<base-modal :modalActive="modalActive" @close-modal="toggleModal">
				<div class="text-black">
					<h1 class="text-2xl mb-1">关于本软件：</h1>
					<p class="mb-4">
						本软件允许您订阅跟踪您所选择区域的天气预报，包括每小时天气预报及10日天气预报。
					</p>
					<h2 class="text-2xl mb-1">工作原理：</h2>
					<ol class="list-decimal list-inside mb-4">
						<li>在输入栏搜索关键词；</li>
						<li>
							在搜索结果中点击该区域，将显示该区域的当前天气情况；
						</li>
						<li>
							单击导航栏右上角的图标 “+”，
							该区域将保存在主页的订阅列表中。
						</li>
					</ol>
					<h2 class="text-2xl mb-1">取消订阅：</h2>
					<p class="mb-4">
						如果您要取消订阅某个区域的天气预报，在主页中选择该区域，并滚动到页面底部，单击图标
						“取消订阅” 即可。
					</p>
				</div>
			</base-modal>
		</nav>
	</header>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { uid } from 'uid';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import BaseModal from '../ui/BaseModal.vue';

const route = new useRoute();
const router = new useRouter();
const store = new useStore();

const addCity = () => {
	const cityObj = {
		id: uid(), // only subscribed city has unique id
		name: route.params.city,
		adcode: route.query.adcode,
	};

	store.commit('addCity', cityObj);

	store.commit('deleteCitiesWeather');

	store.dispatch('storeSavedCities', store.getters.savedCities);

	let query = Object.assign({}, route.query);
	delete query.preview;
	query.id = cityObj.id;

	router.replace({ query });
	router.push({ name: 'home' });
};

const modalActive = ref(null);
const toggleModal = () => {
	modalActive.value = !modalActive.value;
};
</script>
