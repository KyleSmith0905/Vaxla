<script setup lang="ts">
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectItem } from '~/components/ui/select';
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
  <Select v-model:model-value="modalString" @update:model-value="modal = parseInt($event)">
    <SelectTrigger>
      <div class='flex gap-1 items-center'>
        {{ modal }} <span v-if="commonLabels[modal]" class='text-muted-foreground text-xs'>({{commonLabels[modal]}})</span>
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Common</SelectLabel>
        <SelectItem
          v-for="(label, key) in commonLabels"
          :value="`${key}`"
        >
          {{ key }}
          <span class='text-muted-foreground text-xs'>({{label}})</span>
        </SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>All</SelectLabel>
        <SelectItem
          v-for="n in 63"
          :value="`${n + 1}`"
        >
          {{ n + 1 }} <span v-if="commonLabels[n + 1]" class='text-muted-foreground text-xs'>({{ commonLabels[n + 1] }})</span>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>