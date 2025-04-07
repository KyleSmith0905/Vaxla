<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

const props = defineProps<{class?: HTMLAttributes['class'], items: number, variant?: 'default' | 'card'}>();
const gridRef = ref<HTMLDivElement>();
const {width} = useElementBounding(gridRef);

const emptyCells = ref(0);
watch([width, props, gridRef], () => {
  if (!gridRef.value) return;
  const columns = getComputedStyle(gridRef.value).gridTemplateColumns.split(' ');

  const filledCells = props.items % columns.length;
  emptyCells.value = filledCells === 0 ? 0 : columns.length - filledCells
})

</script>

<template>
  <div
    ref="gridRef"
    :class='cn(
      {
        "border-t border-l grid auto-fill-96": true,
        "w-[calc(100%_+_2px)] -translate-x-px translate-y-px rounded-b-lg overflow-hidden": variant === "card"
      },
      props.class
    )'
  >
    <slot/>
    <div class='border-r border-b' v-for="_ of emptyCells"/>
  </div>
</template>