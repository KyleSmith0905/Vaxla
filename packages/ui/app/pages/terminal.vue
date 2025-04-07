<script setup lang="ts">
const activeCommand = ref<{command: string, id: string} | undefined>();

const {id} = useRandomId()

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Terminal']">
    <CardsRunCommand @command-entered="activeCommand = $event" :id="id"/>
    <CardsTerminal :id="id" />
  </NuxtLayout>
</template>
