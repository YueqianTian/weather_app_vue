<template>
	<div class="text-[#eee] bg-[#181818] min-h-screen">
		<Suspense>
			<index-page></index-page>
			<template #fallback> 正在加载... </template>
		</Suspense>
	</div>
</template>

<script setup>
import IndexPage from '../components/indexviews/IndexPage.vue';
</script>
