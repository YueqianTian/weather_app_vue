<template>
	<div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
		<site-navigation></site-navigation>
		<router-view v-slot="{ Component }">
			<transition name="page" mode="out-in">
				<component :is="Component"> </component> </transition
		></router-view>
	</div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SiteNavigation from './components/layout/SiteNavigation.vue';
</script>

<style>
.page-enter-from,
.page-leave-to {
	opacity: 0;
}
.page-enter-active,
.page-leave-active {
	transition: 600ms ease all;
}
</style>
