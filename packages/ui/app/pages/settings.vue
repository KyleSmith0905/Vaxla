<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { Card, CardHeader, CardContent, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '~/components/ui/select';

const isDark = useDark();
const theme = ref('default');

const darkString = computed(() => isDark.value ? 'dark' : 'light')

definePageMeta({
  layout: false,
})
</script>
<template>
  <NuxtLayout name="default" :path="['Settings']">
    <Card>
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
      </CardHeader>
      <CardContent>
        <form class='grid grid-cols-2 gap-2'>
          <Label class='flex flex-col gap-1'>
            Color Schemes
            <Select v-model:modelValue='darkString' @update:model-value="isDark = $event === 'dark'">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <Label class='flex flex-col gap-1'>
            Themes
            <Select v-model="theme">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default">Default</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
        </form>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>