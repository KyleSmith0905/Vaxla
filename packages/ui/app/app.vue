<script setup lang="ts">
const sidebarState = useCookie('sidebar:state');

const defaultOpen = computed(() => (typeof sidebarState.value === 'boolean' ? sidebarState.value : sidebarState.value === 'true'));
</script>
<template>
	<UiSidebarProvider :default-open="defaultOpen" @update:open="sidebarState = $event ? 'true' : 'false'" class="h-full">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UiSidebarProvider>
	<UiToaster />
</template>
