<script setup lang="ts">
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
		<UiCard class="flex h-full shrink-0 flex-col">
			<UiCardHeader>
				<UiCardTitle>Port</UiCardTitle>
			</UiCardHeader>
			<UiCardContent class="flex h-full min-h-0 flex-col px-0 pb-0">
				<div class="z-20 flex gap-2 px-3">
					<UiInput v-model="port" placeholder="12345" />
					<UiButton @click="refresh()" size="icon">
						<Icon name="lucide:refresh-cw" />
					</UiButton>
				</div>
				<UiScrollArea class="justify-content-flex-start flex h-full flex-col justify-center">
					<div class="absolute z-10 h-4 w-full bg-gradient-to-t from-card/0 to-card/100"></div>
					<UiTable v-if="processesSorted && processesSorted.length > 0">
						<UiTableHeader>
							<UiTableRow>
								<UiTableHead class="pl-3">Process ID</UiTableHead>
								<UiTableHead>Name</UiTableHead>
								<UiTableHead>Command</UiTableHead>
								<UiTableHead>GID</UiTableHead>
								<UiTableHead>Parent Process ID</UiTableHead>
								<UiTableHead class="pr-3">User ID</UiTableHead>
							</UiTableRow>
						</UiTableHeader>
						<UiTableBody>
							<UiTableRow v-for="row of processesSorted" asChild>
								<NuxtLink :href="`/processes/${row.pid}`">
									<UiTableCell class="pl-3">{{ row.pid }}</UiTableCell>
									<UiTableCell>{{ row.name }}</UiTableCell>
									<UiTableCell>
										<span class="line-clamp-3 max-w-48 overflow-scroll break-words">
											{{ row.cmd }}
										</span>
									</UiTableCell>
									<UiTableCell>{{ row.gid }}</UiTableCell>
									<UiTableCell>{{ row.ppid }}</UiTableCell>
									<UiTableCell class="pr-3">{{ row.uid }}</UiTableCell>
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
