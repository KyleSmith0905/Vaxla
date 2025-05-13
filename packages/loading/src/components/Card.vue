<script setup lang="ts">
import { cn } from '@/lib/utils';

defineProps<{class?: string}>()
</script>

<template>
  <div :class="cn('relative border-dashed border border-border px-4 py-2', $props.class)">
    <div class='absolute w-px h-[9px] top-0 left-0 -translate-y-1 bg-muted-foreground'></div>
    <div class='absolute w-[9px] h-px top-0 left-0 -translate-x-1 bg-muted-foreground'></div>
    <div class='absolute w-px h-[9px] bottom-0 left-0 translate-y-1 bg-muted-foreground'></div>
    <div class='absolute w-[9px] h-px bottom-0 left-0 -translate-x-1 bg-muted-foreground'></div>
    <div class='absolute w-px h-[9px] top-0 right-0 -translate-y-1 bg-muted-foreground'></div>
    <div class='absolute w-[9px] h-px top-0 right-0 translate-x-1 bg-muted-foreground'></div>
    <div class='absolute w-px h-[9px] bottom-0 right-0 translate-y-1 bg-muted-foreground'></div>
    <div class='absolute w-[9px] h-px bottom-0 right-0 translate-x-1 bg-muted-foreground'></div>
    <slot/>
  </div>
</template>