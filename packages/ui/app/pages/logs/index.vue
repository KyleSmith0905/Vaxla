<script setup lang="ts">
import AnsiToHtml from 'ansi-to-html';
import { getCommandDisplayName, getCommandShellScript } from '@vaxla/shared/command';
import { useScripts } from '~/composables/useScripts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';

const { scripts } = useScripts();

const commandLineToHtml = (logs: string) => {
	const ansiToHtml = new AnsiToHtml();
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
				<table v-if="scripts.length > 0" class="w-full border-b">
					<thead>
						<tr>
							<th class="text-left">Package</th>
							<th class="text-left">Command Name</th>
							<th class="text-left">Command Script</th>
							<th class="text-left">Logs</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="script in scripts" class="hover:bg-accent/50 cursor-pointer border-t" @click="navigateTo(`/logs/${script.id}`)">
							<td class="px-2">
								<UtilityPackageName :package="script.package" />
							</td>
							<td class="px-2">
								<p class="font-semibold">
									{{ getCommandDisplayName({ dynamic: script.command }) }}
								</p>
							</td>
							<td class="p-1">
								<code class="bg-muted block w-fit rounded px-2 py-1 font-mono text-xs font-semibold">
									{{ getCommandShellScript({ dynamic: script.command }, script.package?.path ?? '') }}
								</code>
							</td>
							<td>
								<pre class="max-w-48 scale-75 truncate opacity-50">
                  <code v-html="commandLineToHtml(script.logs[script.logs.length - 1]?.text ?? '')?.slice(0, 240)"/>
                </pre>
							</td>
						</tr>
					</tbody>
				</table>
				<p v-else class="text-muted-foreground py-8 text-center text-sm">Run a command and it'll appear here.</p>
			</CardContent>
		</Card>
	</NuxtLayout>
</template>
