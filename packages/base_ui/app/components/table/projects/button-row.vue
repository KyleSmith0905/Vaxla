<script setup lang="ts">
import { ScriptStatus, type ActiveScript } from '~/utils/packages/types';
import { getCommandShellScript, getCommandDisplayName } from 'base_shared/command';

const appConfig = useBaseScoreConfig();

const props = defineProps<{
	package: (typeof appConfig.packages)[string];
	packageId: string;
}>();

const { scripts, runScript, killScript } = useScripts();

/**
 * Returns a map of active scripts, with the latest script for each id.
 */
const activeScript = computed(() => {
	const map: Record<string, ActiveScript> = {};

	for (const script of scripts.value) {
		if (script.commandIndex === undefined) continue;

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
			<UiTooltip>
				<UiTooltipTrigger as-child>
					<UiButton
						size="icon"
						:class="{
							'size-7 rounded-full border border-zinc-700 bg-muted text-white hover:bg-zinc-800 hover:brightness-125': true,
							'border-green-700 bg-green-800 hover:bg-green-700': activeScript[index]?.status === ScriptStatus.Opened,
						}"
						@click="
							activeScript[index]?.status === ScriptStatus.Opened
								? killScript(activeScript[index]?.id)
								: runScript({ packageId: props.packageId, commandIndex: index })
						"
					>
						<Icon :name="script.icon" />
					</UiButton>
				</UiTooltipTrigger>
				<UiTooltipContent class="flex flex-col">
					<div class="flex items-center gap-2">
						<Icon :name="script.icon" />
						<h1 class="font-header text-base font-bold">{{ getCommandDisplayName({ script }) }}</h1>
					</div>
					<code class="w-fit rounded bg-muted px-2 py-1 font-mono text-xs font-semibold text-muted-foreground">
						{{ getCommandShellScript({ script }, props.package.path ?? '') }}
					</code>
					<div class="flex gap-1 pt-2">
						<template v-if="activeScript[index]?.status === ScriptStatus.Opened">
							<UiButton @click="killScript(activeScript[index]?.id)" size="xs" variant="destructive">
								<Icon name="lucide:trash-2" />
								Kill
							</UiButton>
							<UiButton size="xs" variant="secondary" as-child>
								<NuxtLink :to="`/logs/${activeScript[index]?.id}`">
									<Icon name="lucide:receipt-text" />
									Logs
								</NuxtLink>
							</UiButton>
						</template>
						<template v-else>
							<UiButton @click="runScript({ packageId: props.packageId, commandIndex: index })" size="xs" variant="secondary">
								<Icon name="lucide:play" />
								Run
							</UiButton>
						</template>
					</div>
				</UiTooltipContent>
			</UiTooltip>
		</div>
	</div>
</template>
