<script setup lang="ts">
import { ScriptStatus, type ActiveScript } from '~/utils/packages/types';
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
	const map: Record<string, ActiveScript> = {};

	for (const script of scripts.value) {
		if (script.commandIndex === undefined || script.packageId !== props.packageId) continue;

		const currentCreatedAt = map[script.commandIndex]?.createdAt;
		if (currentCreatedAt && currentCreatedAt > script.createdAt) continue;
		map[script.commandIndex] = script;
	}

	return map;
});
</script>
<template>
	<div class="flex gap-1 px-2">
		<div v-for="(script, index) in props.package.scripts">
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						size="icon"
						:variant="activeScript[index]?.status === ScriptStatus.Opened ? 'success' : 'outline'"
						:class="{
							'size-7': true,
						}"
						@click="
							activeScript[index]?.status === ScriptStatus.Opened
							? killScript(activeScript[index]?.id)
							: runScript({ packageId: props.packageId, commandIndex: index })
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
					<code class="w-fit rounded bg-muted px-2 py-1 font-mono text-xs font-semibold text-muted-foreground">
						{{ getCommandShellScript({ script }, props.package.path ?? '') }}
					</code>
					<div class="flex gap-1 pt-2">
						<template v-if="activeScript[index]?.status === ScriptStatus.Opened">
							<Button @click="killScript(activeScript[index]?.id)" size="xs" variant="destructive">
								<Icon icon="lucide:trash-2" />
								Kill
							</Button>
							<Button size="xs" variant="secondary" as-child>
								<NuxtLink :to="`/logs/${activeScript[index]?.id}`">
									<Icon icon="lucide:receipt-text" />
									Logs
								</NuxtLink>
							</Button>
						</template>
						<template v-else>
							<Button @click="runScript({ packageId: props.packageId, commandIndex: index })" size="xs" variant="secondary">
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
