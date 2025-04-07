<script setup lang="ts">
const modal = defineModel<number>({default: 10});
const modalString = computed(() => `${modal.value}`);

const commonLabels: Record<number, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
  64: 'Base64',
}
</script>
<template>
  <UiSelect v-model:model-value="modalString" @update:model-value="modal = parseInt($event)">
    <UiSelectTrigger>
      <div class='flex gap-1 items-center'>
        {{ modal }} <span v-if="commonLabels[modal]" class='text-muted-foreground text-xs'>({{commonLabels[modal]}})</span>
      </div>
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectGroup>
        <UiSelectLabel>Common</UiSelectLabel>
        <UiSelectItem
          v-for="(label, key) in commonLabels"
          :value="`${key}`"
        >
          {{ key }}
          <span class='text-muted-foreground text-xs'>({{label}})</span>
        </UiSelectItem>
      </UiSelectGroup>
      <UiSelectGroup>
        <UiSelectLabel>All</UiSelectLabel>
        <UiSelectItem
          v-for="n in 63"
          :value="`${n + 1}`"
        >
          {{ n + 1 }} <span v-if="commonLabels[n + 1]" class='text-muted-foreground text-xs'>({{ commonLabels[n + 1] }})</span>
        </UiSelectItem>
      </UiSelectGroup>
    </UiSelectContent>
  </UiSelect>
</template>