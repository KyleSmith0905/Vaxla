<script setup lang="ts">
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
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Input</UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <form class='flex flex-col gap-2'>
          <UiLabel class='flex flex-col gap-1'>
            Text
            <UiTextarea v-model="inputText" />
          </UiLabel>
          <div class='flex gap-2'>
            <UiLabel class='flex flex-col gap-1 w-full'>
              From Base
              <UtilityBaseInput v-model="fromBase" />
            </UiLabel>
            <UiLabel class='flex flex-col gap-1 w-full'>
              To Base
              <UtilityBaseInput v-model="toBase" />
            </UiLabel>
          </div>
        </form>
      </UiCardContent>
    </UiCard>
    <UiCard class='flex-grow'>
      <UiCardHeader>
        <UiCardTitle>Output</UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <UiAlert v-if="convertBase.error" variant='destructive'>
          <UiAlertTitle>Error</UiAlertTitle>
          <UiAlertDescription>{{ convertBase.error }}</UiAlertDescription>
        </UiAlert>
        <p v-if="convertBase.success" class='font-mono break-all'>{{ convertBase.success }}</p>
      </UiCardContent>
    </UiCard>
  </NuxtLayout>
</template>