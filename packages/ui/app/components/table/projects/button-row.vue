<script setup lang="ts">
import { ScriptStatus } from '~/utils/packages/types';
import { getCommandShellScript, getCommandDisplayName } from '@vaxla/shared/command';
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import { useScripts } from '~/composables/useScripts';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Button } from '~/components/ui/button';
import { findIcon } from '~/utils/icons';

const appConfig = await useVaxlaConfig();
const { value: homeMode } = useSettings('homeDisplay');

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
	<div class="flex gap-1 px-2" :class="{'flex-col': homeMode === 'detailed'}">
		<div v-for="(script, id) in props.package.scripts">
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						size="icon"
						:variant="activeScript[id]?.status === ScriptStatus.Opened ? 'success' : 'outline'"
						:class="{
							'size-7': true,
							'justify-between w-full px-4 py-8': homeMode === 'detailed',
						}"
						@click="
							activeScript[id]?.status === ScriptStatus.Opened ? killScript(activeScript[id]?.id) : runScript({ packageId: props.packageId, commandId: id })
						"
					>
						<span v-if="homeMode === 'detailed'" class='flex flex-col items-start gap-2'>
							<span>{{ getCommandDisplayName({ script }).trim() || 'No Name Provided' }}</span>
							<UtilityInlineCode class='bg-secondary/50'>
								{{ getCommandShellScript({ script }, props.package.path ?? '') }}
							</UtilityInlineCode>
						</span>
						<Icon :icon="findIcon(script.icon, script.label)" :class='{"!size-6": homeMode === "detailed"}' />
					</Button>
				</TooltipTrigger>
				<TooltipContent class="flex flex-col">
					<div class="flex items-center gap-2">
						<Icon :icon="findIcon(script.icon, script.label)" />
						<h1 class="text-base font-bold">{{ getCommandDisplayName({ script }) }}</h1>
					</div>
					<UtilityInlineCode>
						{{ getCommandShellScript({ script }, props.package.path ?? '') }}
					</UtilityInlineCode>
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
