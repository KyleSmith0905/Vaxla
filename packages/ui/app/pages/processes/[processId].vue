<script setup lang="ts">
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
			<UiCard>
				<UiCardHeader>
					<UiCardTitle>Process Statistics</UiCardTitle>
				</UiCardHeader>
				<UiCardContent class="flex flex-col gap-2">
					<div class="flex flex-col gap-1">
						<UiLabel>Process ID</UiLabel>
						<div class="min-h-7 rounded-md border border-border px-2 py-1 leading-none">{{ data?.processStats?.pid }}</div>
					</div>
					<div class="flex flex-col gap-1">
						<UiLabel>Name</UiLabel>
						<div class="min-h-7 rounded-md border border-border px-2 py-1 leading-none">{{ data?.processStats?.name }}</div>
					</div>
					<div class="flex flex-col gap-1">
						<UiLabel>Parent Process ID</UiLabel>
						<UiButton variant="outline" as-child class="h-7 justify-start px-2 py-1">
							<NuxtLink :href="`/processes/${data?.processStats?.ppid}`">
								{{ data?.processStats?.ppid }}
							</NuxtLink>
						</UiButton>
					</div>
					<div class="flex flex-col gap-1">
						<UiLabel>User ID</UiLabel>
						<div class="min-h-7 rounded-md border border-border px-2 py-1 leading-none">{{ data?.processStats?.uid }}</div>
					</div>
				</UiCardContent>
			</UiCard>
			<UiCard class="col-span-2 flex flex-col">
				<UiCardHeader>
					<UiCardTitle>Commands</UiCardTitle>
				</UiCardHeader>
				<UiCardContent class="flex flex-grow flex-col">
					<div class="h-0 min-h-7 flex-grow overflow-scroll break-words rounded-md border border-border px-2 py-1 leading-none">
						<span>{{ data?.processStats?.cmd }}</span>
					</div>
				</UiCardContent>
			</UiCard>
		</div>
		<UiCard>
			<UiCardHeader>
				<UiCardTitle>Actions</UiCardTitle>
			</UiCardHeader>
			<UiCardContent class="flex gap-1">
				<UtilityKillProcess :process="processId" />
			</UiCardContent>
		</UiCard>
		<UiCard class="flex-grow">
			<UiCardHeader><UiCardTitle>Network Statistics</UiCardTitle></UiCardHeader>
			<UiCardContent class="px-0">
				<UiScrollArea class="justify-content-flex-start flex h-full flex-col justify-center">
					<div class="absolute z-10 h-4 w-full bg-gradient-to-t from-card/0 to-card/100"></div>
					<UiTable v-if="data?.netstat && data.netstat.length > 0">
						<UiTableHeader>
							<UiTableRow>
								<UiTableHead class="pl-3">PID</UiTableHead>
								<UiTableHead>State</UiTableHead>
								<UiTableHead>Protocol</UiTableHead>
								<UiTableHead>Local</UiTableHead>
								<UiTableHead class="pr-3">Remote</UiTableHead>
							</UiTableRow>
						</UiTableHeader>
						<UiTableBody>
							<UiTableRow v-for="row of data.netstat" asChild>
								<NuxtLink :href="`/processes/${row.pid}`">
									<UiTableCell class="pl-3">{{ row.pid }}</UiTableCell>
									<UiTableCell class="py-1">
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
									</UiTableCell>
									<UiTableCell>{{ row.protocol }}</UiTableCell>
									<UiTableCell>
										<span class="text-xs text-muted-foreground">{{ row.local.address }}:</span>
										{{ row.local.port }}
									</UiTableCell>
									<UiTableCell class="pr-3">
										<span class="text-xs text-muted-foreground">{{ row.remote.address }}:</span>
										{{ row.remote.port }}
									</UiTableCell>
								</NuxtLink>
							</UiTableRow>
						</UiTableBody>
					</UiTable>
					<p v-else class="py-8 text-center text-sm text-muted-foreground">No logs yet.</p>
				</UiScrollArea>
			</UiCardContent>
		</UiCard>
	</NuxtLayout>
</template>
