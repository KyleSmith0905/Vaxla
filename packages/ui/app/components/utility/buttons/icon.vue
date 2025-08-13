<script setup lang="ts">
import type { ButtonVariants } from '~/components/ui/button';
import { Icon } from '@iconify/vue';

defineProps<{
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  disabled?: boolean;
  class?: string;
  icon: string;
  tooltip?: string;
}>();

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <UiTooltip>
    <UiTooltipTrigger>
      <UiButton :variant="variant" :size="size" :disabled="disabled" :class="class" @click="$emit('click', $event)">
        <Icon :icon="icon" />
      </UiButton>
    </UiTooltipTrigger>
    <UiTooltipContent>{{ tooltip }}</UiTooltipContent>
  </UiTooltip>
</template>