<script setup lang="ts">
import { useElementBounding } from '@vueuse/core';
import { cn } from '~/utils/tailwind'

const props = defineProps<{ items: number; variant?: 'default' | 'card' }>();
const gridRef = ref<HTMLDivElement>();
const { width } = useElementBounding(gridRef);

const emptyCells = ref(0);

const computeEmptyCells = () => {
	if (!gridRef.value) return;
	const columns = getComputedStyle(gridRef.value).gridTemplateColumns.split(' ');

	const filledCells = props.items % columns.length;
	emptyCells.value = filledCells === 0 ? 0 : columns.length - filledCells;
}
watch([width, props, gridRef], async () => {
	computeEmptyCells();
	await nextTick();
	computeEmptyCells();
});
</script>

<template>
	<div
		ref="gridRef"
		:class="
			cn(
				{
					'grid border-l border-t auto-fill-96': true,
					'w-[calc(100%_+_2px)] -translate-x-px translate-y-px overflow-hidden rounded-b-lg': variant === 'card',
				},
			)
		"
	>
		<slot />
		<div class="border-b border-r" v-for="_ of emptyCells" />
	</div>
</template>
