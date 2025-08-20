<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from '~/components/ui/table';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

const port = ref('');

const { data, refresh } = useAsyncData('get-port', () => $fetch(`/api/process/get-port`, { query: { port: port.value } }), { watch: [port] });

const processesSorted = computed(() => {
	return data.value?.sort?.((a, b) => a.pid - b.pid);
});

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Processes']">
		<Card class="flex h-full shrink-0 flex-col">
			<CardHeader>
				<CardTitle>Port</CardTitle>
			</CardHeader>
			<CardContent class="flex h-full min-h-0 flex-col px-0 pb-0">
				<div class="z-20 flex gap-2 px-3">
					<Input v-model="port" placeholder="12345" />
					<Button @click="refresh()" size="icon">
						<Icon icon="lucide:refresh-cw" />
					</Button>
				</div>
				<ScrollArea class="justify-content-flex-start flex h-full flex-col justify-center">
					<div class="absolute z-10 h-4 w-full bg-gradient-to-t from-card/0 to-card/100"></div>
					<Table v-if="processesSorted && processesSorted.length > 0">
						<TableHeader>
							<TableRow>
								<TableHead class="pl-3">Process ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Command</TableHead>
								<TableHead>GID</TableHead>
								<TableHead>Parent Process ID</TableHead>
								<TableHead class="pr-3">User ID</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow v-for="row of processesSorted" asChild>
								<NuxtLink :href="`/processes/${row.pid}`">
									<TableCell class="pl-3">{{ row.pid }}</TableCell>
									<TableCell>{{ row.name }}</TableCell>
									<TableCell>
										<span class="line-clamp-3 max-w-48 overflow-scroll break-words">
											{{ row.cmd }}
										</span>
									</TableCell>
									<TableCell>{{ row.gid }}</TableCell>
									<TableCell>{{ row.ppid }}</TableCell>
									<TableCell class="pr-3">{{ row.uid }}</TableCell>
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
