<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { Toaster } from './components/ui/sonner';

useDark();
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<Toaster rich-colors />
</template>
