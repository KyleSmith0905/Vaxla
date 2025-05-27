<script setup lang="ts">
import colors from 'tailwindcss/colors';
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import QrCode from 'qrcode-vue3';

const code = ref('');

definePageMeta({
  layout: false,
})
</script>
<template>
  <NuxtLayout name="default" :path="['QR Generator']">
    <Card>
      <CardHeader>
        <CardTitle>Enter QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        <form class='flex gap-2'>
          <Input v-model="code" placeholder="https://example.com" />
        </form>
      </CardContent>
    </Card>
    <Card class='flex-grow'>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription v-if="code">QR code is "{{ code }}" when scanned.</CardDescription>
        <CardDescription v-else>When a QR code is entered, it will appear beneath.</CardDescription>
      </CardHeader>
      <CardContent>
        <QrCode
          v-if="code"
          :width="512"
          :height="512"
          :value="code"
          :key="code"
          :qr-options="{
            errorCorrectionLevel: 'H'
          }"
          :dotsOptions="{
            color: colors.zinc[50],
            type: 'square'
          }"
          :backgroundOptions="{
            color: colors.zinc[950],
          }"
          :cornersSquareOptions="{
            color: colors.zinc[50],
            type: 'square',
          }"
          class='max-w-96'
        />
        <p v-else class='text-sm text-muted-foreground text-center py-8'>No QR code yet.</p>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>