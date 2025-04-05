<script setup lang="ts">
const route = useRoute();
const processId = computed(() => route.params.processId as string)

const { data, refresh } = await useAsyncData(
  'get-port',
  () => $fetch(`/api/process/get-process`, {query: {process: processId.value}}),
  { watch: [processId], }
);

const killPort = (signal: "SIGKILL" | "SIGTERM") => {
  $fetch('/api/process/kill-port', {
    method: 'POST',
    query: {
      process: processId.value,
      signal: signal,
    }
  });
}

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Processes', '']">
    <div class='grid grid-cols-3 gap-2'>
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Process Statistics</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class='flex flex-col gap-2'>
          <div class='flex flex-col gap-1'>
            <UiLabel>Process ID</UiLabel>
            <div class='rounded-md border border-border px-2 py-1 leading-none min-h-7'>{{ data?.processStats?.pid }}</div>
          </div>
          <div class='flex flex-col gap-1'>
            <UiLabel>Name</UiLabel>
            <div class='rounded-md border border-border px-2 py-1 leading-none min-h-7'>{{ data?.processStats?.name }}</div>
          </div>
          <div class='flex flex-col gap-1'>
            <UiLabel>Parent Process ID</UiLabel>
            <UiButton variant='outline' as-child class='justify-start px-2 py-1 h-7'>
              <NuxtLink :href="`/processes/${data?.processStats?.ppid}`">
                {{ data?.processStats?.ppid }}
              </NuxtLink>
            </UiButton>
          </div>
          <div class='flex flex-col gap-1'>
            <UiLabel>User ID</UiLabel>
            <div class='rounded-md border border-border px-2 py-1 leading-none min-h-7'>{{ data?.processStats?.uid }}</div>
          </div>
        </UiCardContent>
      </UiCard>
      <UiCard class='flex flex-col col-span-2'>
        <UiCardHeader>
          <UiCardTitle>Commands</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class='flex flex-col flex-grow'>
          <div class='rounded-md border border-border px-2 py-1 overflow-scroll leading-none min-h-7 h-0 break-words flex-grow'>
            <span>{{ data?.processStats?.cmd }}</span>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Actions</UiCardTitle>
      </UiCardHeader>
      <UiCardContent class='flex gap-1'>
        <UiTooltip>
          <UiTooltipTrigger>
            <UiButton @click="killPort('SIGTERM')" variant='destructive' size='icon'>
              <Icon name="lucide:heart-off"/>
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            Requests a process to terminate gracefully
          </UiTooltipContent>
        </UiTooltip>
        <UiTooltip>
          <UiTooltipTrigger>
            <UiButton @click="killPort('SIGKILL')" variant='destructive' size='icon'>
              <Icon name="lucide:power-off"/>
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            Forces a process to terminate immediately
          </UiTooltipContent>
        </UiTooltip>
      </UiCardContent>
    </UiCard>
    <UiCard class='flex-grow'>
      <UiCardHeader><UiCardTitle>Network Statistics</UiCardTitle></UiCardHeader>
      <UiCardContent class='px-0'>
        <UiScrollArea class='flex flex-col h-full justify-center justify-content-flex-start'>
          <div class='absolute w-full h-4 bg-gradient-to-t from-card/0 to-card/100 z-10'></div>
          <UiTable v-if="data?.netstat && data.netstat.length > 0">
            <UiTableHeader>
              <UiTableRow>
                <UiTableHead class='pl-3'>PID</UiTableHead>
                <UiTableHead>State</UiTableHead>
                <UiTableHead>Protocol</UiTableHead>
                <UiTableHead>Local</UiTableHead>
                <UiTableHead class='pr-3'>Remote</UiTableHead>
              </UiTableRow>
            </UiTableHeader>
            <UiTableBody>
              <UiTableRow v-for="row of data.netstat" asChild>
                <NuxtLink :href='`/processes/${row.pid}`'>
                  <UiTableCell class='pl-3'>{{ row.pid }}</UiTableCell>
                  <UiTableCell class='py-1'>
                    <span
                      class='px-2 py-1 rounded-md text-xs text-background'
                      :class='{
                        "bg-green-500": row.state as any === "LISTENING",
                        "bg-amber-500": row.state as any === "TIME_WAIT",
                        "bg-yellow-500": row.state as any === "SYN_SENT",
                        "bg-blue-500": row.state === "ESTABLISHED",
                        "bg-violet-500": row.state === "CLOSE_WAIT",
                      }'
                    >
                      {{ row.state }}
                    </span>
                  </UiTableCell>
                  <UiTableCell>{{ row.protocol }}</UiTableCell>
                  <UiTableCell><span class='text-muted-foreground text-xs'>{{ row.local.address }}:</span>{{ row.local.port }}</UiTableCell>
                  <UiTableCell class='pr-3'><span class='text-muted-foreground text-xs'>{{ row.remote.address }}:</span>{{ row.remote.port }}</UiTableCell>
                </NuxtLink>
              </UiTableRow>
            </UiTableBody>
          </UiTable>
          <p v-else class='text-sm text-muted-foreground text-center py-8'>No logs yet.</p>
        </UiScrollArea>
      </UiCardContent>
    </UiCard>
  </NuxtLayout>
</template>