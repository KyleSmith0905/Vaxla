<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '~/components/ui/alert'
import BaseInput from '~/components/utility/base-input.vue'

const inputText = ref('');
const fromBase = ref(10);
const toBase = ref(10);

const convertBase = computed(() => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
  
  // Convert input to decimal (base 10)
  let decimalValue = 0;
  for (let i = 0; i < inputText.value.length; i++) {
    const value = chars.indexOf(inputText.value[i] ?? '');
    if (value === -1 || value >= fromBase.value) {
      return {error: `Invalid character '${inputText.value[i]}' for base ${fromBase}.`};
    }
    decimalValue = decimalValue * fromBase.value + value;
  }
  
  // Convert decimal to target base
  let output = "";
  do {
    const remainder = decimalValue % toBase.value;
    output = chars[remainder] + output;
    decimalValue = Math.floor(decimalValue / toBase.value);
  }
  while (decimalValue > 0);
  
  return {success: output};
})

definePageMeta({
  layout: false,
})
</script>
<template>
  <NuxtLayout name="default" :path="['Base Conversion']">
    <Card>
      <CardHeader>
        <CardTitle>Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form class='flex flex-col gap-2'>
          <Label class='flex flex-col gap-1'>
            Text
            <Textarea v-model="inputText" />
          </Label>
          <div class='flex gap-2'>
            <Label class='flex flex-col gap-1 w-full'>
              From Base
              <BaseInput v-model="fromBase" />
            </Label>
            <Label class='flex flex-col gap-1 w-full'>
              To Base
              <BaseInput v-model="toBase" />
            </Label>
          </div>
        </form>
      </CardContent>
    </Card>
    <Card class='flex-grow'>
      <CardHeader>
        <CardTitle>Output</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert v-if="convertBase.error" variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ convertBase.error }}</AlertDescription>
        </Alert>
        <p v-if="convertBase.success" class='font-mono break-all'>{{ convertBase.success }}</p>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>