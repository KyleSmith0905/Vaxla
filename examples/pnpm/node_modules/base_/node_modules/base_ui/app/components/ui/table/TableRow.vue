<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/tailwind'
import { Primitive, type PrimitiveProps } from 'radix-vue';

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'tr',
})
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('table-row border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', props.class)"
  >
    <slot />
  </Primitive>
</template>
