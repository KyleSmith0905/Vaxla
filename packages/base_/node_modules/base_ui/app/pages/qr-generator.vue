<script setup lang="ts">
import colors from 'tailwindcss/colors';
const code = ref('');

definePageMeta({
  layout: false,
})
</script>
<template>
  <NuxtLayout name="default" :path="['QR Generator']">
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Enter QR Code</UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <form class='flex gap-2'>
          <UiInput v-model="code" placeholder="https://example.com" />
        </form>
      </UiCardContent>
    </UiCard>
    <UiCard class='flex-grow'>
      <UiCardHeader>
        <UiCardTitle>QR Code</UiCardTitle>
        <UiCardDescription v-if="code">QR code is "{{ code }}" when scanned.</UiCardDescription>
        <UiCardDescription v-else>When a QR code is entered, it will appear beneath.</UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <Qrcode
          v-if="code"
          :value="code"
          variant="rounded"
          :blackColor="colors.zinc[50]"
          :radius="8"
          class='max-w-96 border rounded-lg'
        />
        <p v-else class='text-sm text-muted-foreground text-center py-8'>No QR code yet.</p>
      </UiCardContent>
    </UiCard>
  </NuxtLayout>
</template>