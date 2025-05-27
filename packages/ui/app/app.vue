<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { SidebarProvider } from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';

const sidebarState = useCookie('sidebar:state');

useDark();

const defaultOpen = computed(() => (typeof sidebarState.value === 'boolean' ? sidebarState.value : sidebarState.value === 'true'));
</script>
<template>
	<SidebarProvider :default-open="defaultOpen" @update:open="sidebarState = $event ? 'true' : 'false'" class="h-full">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</SidebarProvider>
	<Toaster />
</template>
