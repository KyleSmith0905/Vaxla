<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="cn('inline-flex items-center justify-center gap-2 whitespace-nowrap underline cursor-pointer disabled:no-underline disabled:pointer-events-none disabled:opacity-50 outline-none text-primary underline-offset-4', props.class)"
  >
    <slot />_
  </Primitive>
</template>
