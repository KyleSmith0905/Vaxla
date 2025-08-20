<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue';
defineProps<{
	icon: string;
	class?: string;
}>();
</script>

<template>
	<IconifyIcon :icon="icon" :class="class" />
</template>
