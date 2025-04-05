<script setup lang="ts">
import AnsiToHtml from 'ansi-to-html';
import colors from 'tailwindcss/colors';

const {scripts} = useScripts();

const logsMap = computed(() => {
  const ansiToHtml = new AnsiToHtml({fg: colors.zinc[50], bg: colors.zinc[950], newline: false});
  return Object.fromEntries(scripts.value.map((e) => [e.command, ansiToHtml.toHtml(e.logs[e.logs.length - 1]?.text.trim?.() ?? '')]))
})

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Logs']">
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Logs</UiCardTitle>
        <UiCardDescription>{{ scripts.length }} scripts are currently running.</UiCardDescription>
      </UiCardHeader>
      <UiCardContent class='px-0'>
        <div v-if="scripts.length > 0" class='divide-y divide-border border-y'>
          <NuxtLink v-for="script in scripts" class='flex flex-col gap-1 py-1 px-3 w-full hover:bg-accent/50' :to="`/logs/${script.id}`">
            <div class='flex justify-between items-center'>
              <code class='rounded bg-muted px-2 py-1 font-mono text-xs font-semibold w-fit shrink-0'>{{ script.command }}</code>
              <pre class='opacity-50 truncate scale-75'>
                <code v-html="logsMap[script.command]?.slice(0, 240)"/>
              </pre>
            </div>
          </NuxtLink>
        </div>
        <p v-else class='text-sm text-muted-foreground text-center py-8'>Run a command and it'll appear here.</p>
      </UiCardContent>
    </UiCard>
  </NuxtLayout>
</template>
