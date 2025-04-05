<script setup lang="ts">
import { ScriptStatus } from '~/utils/packages/types';

const props = defineProps<{id?: string}>();
const {getScript, killScript} = useScripts();
const dayjs = useDayjs();

const date = useLocalStorage('terminal-date', false, {initOnMounted: true});
const script = computed(() => props.id ? getScript(props.id) : undefined);

</script>
<template>
  <UiCard class='flex flex-col flex-grow min-h-0'>
    <UiCardHeader class='flex flex-row gap-2 justify-between'>
      <div class='flex flex-col gap-1.5 w-fit'>
        <UiCardTitle>Command Logs</UiCardTitle>
        <div v-if="script" class='flex gap-2'>
          <UiBadge class='flex gap-2'><Icon name="lucide:clock"/>{{ dayjs(script?.createdAt).format('LT') }}</UiBadge>
          <UiBadge class='flex gap-2 font-mono'><Icon name="lucide:terminal"/>{{ script.command }}</UiBadge>
          <UiBadge
            :class='{
              "flex gap-2 bg-red-300 hover:bg-red-400": true,
              "bg-green-300 hover:bg-green-400": script?.status === ScriptStatus.Opened,
            }'
          >
            <Icon name="lucide:stethoscope"/>
            <template v-if="script?.status === ScriptStatus.Opened">Opened</template>
            <template v-else>Closed</template>
          </UiBadge>
        </div>
      </div>
      <div class='flex gap-2'>
        <UiButton :variant='date ? "default" : "secondary"' size='icon' @click="date = !date"><Icon name="lucide:clock"/></UiButton>
        <UiButton :disabled='script?.status !== ScriptStatus.Opened' variant='destructive' size='icon' @click="killScript(id)">
          <Icon name="lucide:trash-2"/>
        </UiButton>
      </div>
    </UiCardHeader>
    <UiCardContent class='min-h-0 px-0'>
      <UtilityTerminal :logs="script?.logs ?? []" :date="date"/>
    </UiCardContent>
  </UiCard>
</template>