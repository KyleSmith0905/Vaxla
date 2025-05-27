<script setup lang="tsx">
import AnsiToHtml from 'ansi-to-html';
import colors from 'tailwindcss/colors';
import type { ActiveScript } from '~/utils/packages/types';
import { cn } from '@/utils/tailwind';

const props = defineProps<{logs: ActiveScript['logs'], date: boolean}>();

const dayjs = useDayjs();

const validLinks = ref<Record<string, boolean>>({});

const logs = computed(() => {
  const ansiToHtml = new AnsiToHtml({fg: colors.zinc[50], bg: colors.zinc[950], newline: false});
  
  const logs = props.logs.map((e) => {
    let text = ansiToHtml.toHtml(e.text.trim());

    return {text, date: e.date, type: e.type};
  });

  return logs;
})
</script>
<template>
  <UiScrollArea class='flex flex-col h-full justify-center justify-content-flex-start'>
    <pre v-if="logs && logs.length > 0" class='flex'>
      <code class='flex flex-col w-full text-sm divide-y divide-border'>
        <span v-for="log of logs" class='flex items-center gap-2 py-px pl-3 pr-2' :class="cn({'bg-cyan-950/25': log.type === 'meta', 'bg-red-950/25': log.type === 'error'})">
          <span v-if="date" class='select-none text-xs text-muted-foreground'>{{ dayjs(log.date).format('LTS') }}</span>
          <div class='text-wrap brightness-75 dark:brightness-150' v-html="log.text.trim()"></div>
        </span>
      </code>
    </pre>
    <p v-else class='text-sm text-muted-foreground text-center py-8'>No logs yet.</p>
  </UiScrollArea>
</template>