<script setup lang="ts">
import colors from 'tailwindcss/colors';

defineProps<{
	package: {
		name: string;
		color: string;
	};
}>();
</script>

<template>
	<div class="flex items-center gap-2">
		<div
			class="size-2 rounded-full border"
			:style="{
				backgroundColor: package.color?.[700] ?? colors.neutral[700],
				borderColor: package.color?.[500] ?? colors.neutral[500],
			}"
		/>
		<p class="font-bold">{{ package.name }}</p>
	</div>
</template>
