<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody } from '~/components/ui/table';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import KillProcess from '~/components/utility/kill-process.vue';

const route = useRoute();
const processId = computed(() => route.params.processId as string);

const { data } = await useAsyncData('get-port', () => $fetch(`/api/process/get-process`, { query: { process: processId.value } }), { watch: [processId] });

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Processes', '']">
		<div class="grid grid-cols-3 gap-2">
			<Card>
				<CardHeader>
					<CardTitle>Process Statistics</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-2">
					<div class="flex flex-col gap-1">
						<Label>Process ID</Label>
						<div class="min-h-7 rounded-md border border-border px-2 py-1 leading-none">{{ data?.processStats?.pid }}</div>
					</div>
					<div class="flex flex-col gap-1">
						<Label>Name</Label>
						<div class="min-h-7 rounded-md border border-border px-2 py-1 leading-none">{{ data?.processStats?.name }}</div>
					</div>
					<div class="flex flex-col gap-1">
						<Label>Parent Process ID</Label>
						<Button variant="outline" as-child class="h-7 justify-start px-2 py-1">
							<NuxtLink :href="`/processes/${data?.processStats?.ppid}`">
								{{ data?.processStats?.ppid }}
							</NuxtLink>
						</Button>
					</div>
					<div class="flex flex-col gap-1">
						<Label>User ID</Label>
						<div class="min-h-7 rounded-md border border-border px-2 py-1 leading-none">{{ data?.processStats?.uid }}</div>
					</div>
				</CardContent>
			</Card>
			<Card class="col-span-2 flex flex-col">
				<CardHeader>
					<CardTitle>Commands</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-grow flex-col">
					<div class="h-0 min-h-7 flex-grow overflow-scroll break-words rounded-md border border-border px-2 py-1 leading-none">
						<span>{{ data?.processStats?.cmd }}</span>
					</div>
				</CardContent>
			</Card>
		</div>
		<Card>
			<CardHeader>
				<CardTitle>Actions</CardTitle>
			</CardHeader>
			<CardContent class="flex gap-1">
				<KillProcess :process="processId" />
			</CardContent>
		</Card>
		<Card class="flex-grow">
			<CardHeader><CardTitle>Network Statistics</CardTitle></CardHeader>
			<CardContent class="px-0">
				<ScrollArea class="justify-content-flex-start flex h-full flex-col justify-center">
					<div class="absolute z-10 h-4 w-full bg-gradient-to-t from-card/0 to-card/100"></div>
					<Table v-if="data?.netstat && data.netstat.length > 0">
						<TableHeader>
							<TableRow>
								<TableHead class="pl-3">PID</TableHead>
								<TableHead>State</TableHead>
								<TableHead>Protocol</TableHead>
								<TableHead>Local</TableHead>
								<TableHead class="pr-3">Remote</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow v-for="row of data.netstat" asChild>
								<NuxtLink :href="`/processes/${row.pid}`">
									<TableCell class="pl-3">{{ row.pid }}</TableCell>
									<TableCell class="py-1">
										<span
											class="rounded-md px-2 py-1 text-xs text-background"
											:class="{
												'bg-green-500': (row.state as any) === 'LISTENING',
												'bg-amber-500': (row.state as any) === 'TIME_WAIT',
												'bg-yellow-500': (row.state as any) === 'SYN_SENT',
												'bg-blue-500': row.state === 'ESTABLISHED',
												'bg-violet-500': row.state === 'CLOSE_WAIT',
											}"
										>
											{{ row.state }}
										</span>
									</TableCell>
									<TableCell>{{ row.protocol }}</TableCell>
									<TableCell>
										<span class="text-xs text-muted-foreground">{{ row.local.address }}:</span>
										{{ row.local.port }}
									</TableCell>
									<TableCell class="pr-3">
										<span class="text-xs text-muted-foreground">{{ row.remote.address }}:</span>
										{{ row.remote.port }}
									</TableCell>
								</NuxtLink>
							</TableRow>
						</TableBody>
					</Table>
					<p v-else class="py-8 text-center text-sm text-muted-foreground">No logs yet.</p>
				</ScrollArea>
			</CardContent>
		</Card>
	</NuxtLayout>
</template>
