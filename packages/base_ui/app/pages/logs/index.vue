<script setup lang="ts">
import AnsiToHtml from 'ansi-to-html';
import colors from 'tailwindcss/colors';
import { getCommandDisplayName, getCommandShellScript } from 'base_shared/command';

const { scripts } = useScripts();

const logsMap = computed(() => {
	const ansiToHtml = new AnsiToHtml({ fg: colors.zinc[50], bg: colors.zinc[950], newline: false });
	return Object.fromEntries(scripts.value.map((e) => [e.command, ansiToHtml.toHtml(e.logs[e.logs.length - 1]?.text.trim?.() ?? '')]));
});

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Logs']">
		<UiCard>
			<UiCardHeader>
				<UiCardTitle>Logs</UiCardTitle>
				<UiCardDescription>{{ scripts.length }} scripts are currently running.</UiCardDescription>
			</UiCardHeader>
			<UiCardContent class="px-0">
				<table v-if="scripts.length > 0" class="w-full border-b">
					<tbody>
						<tr v-for="script in scripts" class="cursor-pointer border-t hover:bg-accent/50" @click="navigateTo(`/logs/${script.id}`)">
							<td class="px-2">
								<p class="font-semibold">
									{{ getCommandDisplayName({ dynamic: script.command }) }}
								</p>
							</td>
							<td class="p-1">
								<code class="block w-fit rounded bg-muted px-2 py-1 font-mono text-xs font-semibold">
									{{ getCommandShellScript({ dynamic: script.command }, 'packages/base_ui') }}
								</code>
							</td>
							<td>
								<pre class="scale-75 truncate opacity-50">
                  <code v-html="logsMap[script.command]?.slice(0, 240)"/>
                </pre>
							</td>
						</tr>
					</tbody>
				</table>
				<p v-else class="py-8 text-center text-sm text-muted-foreground">Run a command and it'll appear here.</p>
			</UiCardContent>
		</UiCard>
	</NuxtLayout>
</template>
