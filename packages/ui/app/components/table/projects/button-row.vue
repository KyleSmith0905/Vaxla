<script setup lang="ts">
import { ScriptStatus } from '~/utils/packages/types';
import { getCommandShellScript, getCommandDisplayName } from '@vaxla/shared/command';
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import { useScripts } from '~/composables/useScripts';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Button } from '~/components/ui/button';
import { Icon } from '@iconify/vue';

const appConfig = await useVaxlaConfig();

const props = defineProps<{
	package: (typeof appConfig.value.packages)[string];
	packageId: string;
}>();

const { scripts, runScript, killScript } = useScripts();

/**
 * Returns a map of active scripts, with the latest script for each id.
 */
const activeScript = computed(() => {
	const map: Record<string, (typeof scripts.value)[number]> = {};

	for (const script of scripts.value) {
		if (!script.commandId || script.packageId !== props.packageId) continue;

		const currentCreatedAt = map[script.commandId]?.createdAt;
		if (currentCreatedAt && currentCreatedAt > script.createdAt) continue;
		map[script.commandId] = script;
	}

	return map;
});
</script>
<template>
	<div class="flex gap-1 px-2">
		<div v-for="(script, id) in props.package.scripts">
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						size="icon"
						:variant="activeScript[id]?.status === ScriptStatus.Opened ? 'success' : 'outline'"
						:class="{
							'size-7': true,
						}"
						@click="
							activeScript[id]?.status === ScriptStatus.Opened ? killScript(activeScript[id]?.id) : runScript({ packageId: props.packageId, commandId: id })
						"
					>
						<Icon :icon="script.icon || 'lucide:circle-dashed'" />
					</Button>
				</TooltipTrigger>
				<TooltipContent class="flex flex-col">
					<div class="flex items-center gap-2">
						<Icon :icon="script.icon || 'lucide:circle-dashed'" />
						<h1 class="text-base font-bold">{{ getCommandDisplayName({ script }) }}</h1>
					</div>
					<code class="bg-muted text-muted-foreground w-fit rounded px-2 py-1 font-mono text-xs font-semibold">
						{{ getCommandShellScript({ script }, props.package.path ?? '') }}
					</code>
					<div class="flex gap-1 pt-2">
						<template v-if="activeScript[id]?.status === ScriptStatus.Opened">
							<Button @click="killScript(activeScript[id]?.id)" size="xs" variant="destructive">
								<Icon icon="lucide:trash-2" />
								Kill
							</Button>
							<Button size="xs" variant="secondary" as-child>
								<NuxtLink :to="`/logs/${activeScript[id]?.id}`">
									<Icon icon="lucide:receipt-text" />
									Logs
								</NuxtLink>
							</Button>
						</template>
						<template v-else>
							<Button @click="runScript({ packageId: props.packageId, commandId: id })" size="xs" variant="secondary">
								<Icon icon="lucide:play" />
								Run
							</Button>
						</template>
					</div>
				</TooltipContent>
			</Tooltip>
		</div>
	</div>
</template>
