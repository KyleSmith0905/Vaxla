<script setup lang="ts">
import AnsiToHtml from 'ansi-to-html';
import { getCommandDisplayName, getCommandShellScript } from '@base_/shared/command';
import { useScripts } from '~/composables/useScripts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';

const { scripts } = useScripts();

const commandLineToHtml = (logs: string) => {
	const ansiToHtml = new AnsiToHtml()
	return ansiToHtml.toHtml(logs.trim());
};

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Logs']">
		<Card>
			<CardHeader>
				<CardTitle>Logs</CardTitle>
				<CardDescription>{{ scripts.length }} scripts are currently running.</CardDescription>
			</CardHeader>
			<CardContent class="px-0">
				<p>{{ logsMap }}</p>
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
									{{ getCommandShellScript({ dynamic: script.command }, 'packages/ui') }}
								</code>
							</td>
							<td>
								<pre class="scale-75 truncate opacity-50">
                  <code v-html="commandLineToHtml(script.logs[script.logs.length - 1]?.text ?? '')?.slice(0, 240)"/>
                </pre>
							</td>
						</tr>
					</tbody>
				</table>
				<p v-else class="py-8 text-center text-sm text-muted-foreground">Run a command and it'll appear here.</p>
			</CardContent>
		</Card>
	</NuxtLayout>
</template>
