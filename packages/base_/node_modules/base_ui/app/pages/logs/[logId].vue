<script setup lang="ts">
const route = useRoute();

const {getScript} = useScripts();
const script = computed(() => getScript(route.params.logId as string));

definePageMeta({
  layout: false,
});
</script>
<template>
  <NuxtLayout name="default" :path="['Logs', script?.command]">
    <CardsTerminal :id="script?.id" />
  </NuxtLayout>
</template>