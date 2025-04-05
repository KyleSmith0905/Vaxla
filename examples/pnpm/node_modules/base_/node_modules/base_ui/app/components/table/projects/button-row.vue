<script setup lang="ts">
import {
  ScriptStatus,
  type ActiveScript,
  type ScriptType,
} from "~/utils/packages/types";

const appConfig = useAppConfig();

const props = defineProps<{
  package: (typeof appConfig.packagesInfo)[string];
  type: ScriptType;
  packageId: string;
}>();
const filteredScripts = computed(() =>
  props.package.scripts.filter((e) => e.type === props.type),
);

const { scripts, runScript, killScript } = useScripts();

const script = computed(() => {
  const map: Record<string, ActiveScript> = {};

  for (const script of scripts.value) {
    const currentCreatedAt = map[script.command]?.createdAt;
    if (currentCreatedAt && currentCreatedAt > script.createdAt) continue;
    map[script.command] = script;
  }

  return map;
});
</script>
<template>
  <div class="flex gap-1">
    <div v-for="scripts in filteredScripts">
      <UiTooltip>
        <UiTooltipTrigger as-child>
          <UiButton
            size="icon"
            :class="{
              'size-7 rounded-full bg-muted hover:bg-zinc-800 hover:brightness-125 text-white border border-zinc-700': true,
              'bg-green-800 hover:bg-green-700 border-green-700':
                script[scripts.command]?.status === ScriptStatus.Opened,
            }"
            @click="
              script[scripts.command]?.status === ScriptStatus.Opened
                ? killScript(script[scripts.command]?.id)
                : runScript(scripts.command)
            "
          >
            <Icon :name="scripts.icon" />
          </UiButton>
        </UiTooltipTrigger>
        <UiTooltipContent class="flex flex-col">
          <div class="flex items-center gap-2">
            <Icon :name="scripts.icon" />
            <h1 class="font-bold text-base font-header">{{ scripts.label }}</h1>
          </div>
          <code
            class="rounded w-fit bg-muted text-muted-foreground px-2 py-1 font-mono text-xs font-semibold"
            >{{ scripts.command }}</code
          >
          <div class="pt-2 flex gap-1">
            <template
              v-if="script[scripts.command]?.status === ScriptStatus.Opened"
            >
              <UiButton
                @click="killScript(script[scripts.command]?.id)"
                size="xs"
                variant="destructive"
                ><Icon name="lucide:trash-2" /> Kill</UiButton
              >
              <UiButton size="xs" variant="secondary" as-child>
                <NuxtLink :to="`/logs/${script[scripts.command]?.id}`">
                  <Icon name="lucide:receipt-text" /> Logs
                </NuxtLink>
              </UiButton>
            </template>
            <template v-else>
              <UiButton
                @click="runScript(scripts.command)"
                size="xs"
                variant="secondary"
                ><Icon name="lucide:play" /> Run</UiButton
              >
            </template>
          </div>
        </UiTooltipContent>
      </UiTooltip>
    </div>
  </div>
</template>
