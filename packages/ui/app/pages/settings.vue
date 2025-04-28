<script setup lang="ts">
import { useDark } from '@vueuse/core';

const dark = useDark();
const theme = ref('default');

const darkString = computed(() => dark ? 'dark' : 'light')

definePageMeta({
  layout: false,
})
</script>
<template>
  <NuxtLayout name="default" :path="['Settings']">
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Personalization</UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <form class='grid grid-cols-2 gap-2'>
          <UiLabel class='flex flex-col gap-1'>
            Color Schemes
            <UiSelect v-model:modelValue='darkString' @update:model-value="dark = $event === 'dark'">
              <UiSelectTrigger>
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem value="light">Light</UiSelectItem>
                  <UiSelectItem value="dark">Dark</UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </UiLabel>
          <UiLabel class='flex flex-col gap-1'>
            Themes
            <UiSelect v-model="theme">
              <UiSelectTrigger>
                <UiSelectValue />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem value="default">Default</UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </UiLabel>
        </form>
      </UiCardContent>
    </UiCard>
  </NuxtLayout>
</template>