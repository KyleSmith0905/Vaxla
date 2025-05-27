<script setup lang="ts">
import { useRandomId } from '~/composables/useRandomId';
import RunCommand from '~/components/cards/run-command.vue';
import Terminal from '~/components/cards/terminal.vue';

const activeCommand = ref<{command: string, id: string} | undefined>();

const {id} = useRandomId()

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Terminal']">
    <RunCommand @command-entered="activeCommand = $event" :id="id"/>
    <Terminal :id="id" />
  </NuxtLayout>
</template>
