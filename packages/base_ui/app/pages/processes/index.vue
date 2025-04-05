<script setup lang="ts">
const port = ref('');

const { data, refresh } = useAsyncData(
  'get-port',
  () => $fetch(`/api/process/get-port`, {query: {port: port.value}}),
  { watch: [port], }
);

const statuses = {
  LISTENING: {
    color: 'bg-green-500',
    description: 'The socket is listening for incoming connections.',
    title: 'Listening'
  },
  ESTABLISHED: {
    color: 'bg-blue-500',
    description: 'The socket has an established connection.',
    title: 'Established'
  },
  SYN_SENT: {
    color: 'bg-yellow-500',
    description: 'The socket is actively attempting to establish a connection.',
    title: 'Synchronize Sent'
  },
  TIME_WAIT: {
    color: 'bg-amber-500',
    description: 'The socket is waiting after close to handle packets still in the network.',
    title: 'Time Wait'
  },
  CLOSE_WAIT: {
    color: 'bg-violet-500',
    description: 'The remote end has shut down, waiting for the socket to close.',
    title: 'Close Wait'
  }
}

const processesSorted = computed(() => {
  const order = Object.keys(statuses);

  const getIndex = (state?: string) => {
    const index = order.indexOf(state ?? '')
    if (index === -1) return Number.POSITIVE_INFINITY;
    return index;
  }

  return data.value?.sort((a, b) => a.pid - b.pid)
})

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Processes']">
    <UiCard class='flex flex-col h-full shrink-0'>
      <UiCardHeader>
        <UiCardTitle>Port</UiCardTitle>
      </UiCardHeader>
      <UiCardContent class='px-0 pb-0 flex flex-col min-h-0 h-full'>
        <div class='flex gap-2 px-3 z-20'>
          <UiInput v-model="port" placeholder="12345" />
          <UiButton @click="refresh()" size='icon'>
            <Icon name="lucide:refresh-cw"/>
          </UiButton>
        </div>
        <UiScrollArea class='flex flex-col h-full justify-center justify-content-flex-start'>
          <div class='absolute w-full h-4 bg-gradient-to-t from-card/0 to-card/100 z-10'></div>
          <UiTable v-if="processesSorted && processesSorted.length > 0">
            <UiTableHeader>
              <UiTableRow>
                <UiTableHead class='pl-3'>Process ID</UiTableHead>
                <UiTableHead>Name</UiTableHead>
                <UiTableHead>Command</UiTableHead>
                <UiTableHead>GID</UiTableHead>
                <UiTableHead>Parent Process ID</UiTableHead>
                <UiTableHead class='pr-3'>User ID</UiTableHead>
              </UiTableRow>
            </UiTableHeader>
            <UiTableBody>
              <UiTableRow v-for="row of processesSorted" asChild>
                <NuxtLink :href='`/processes/${row.pid}`'>
                  <UiTableCell class='pl-3'>{{ row.pid }}</UiTableCell>
                  <UiTableCell>{{ row.name }}</UiTableCell>
                  <UiTableCell>
                    <span class='max-w-48 line-clamp-3 break-words overflow-scroll'>
                      {{ row.cmd }}
                    </span>
                  </UiTableCell>
                  <UiTableCell>{{ row.gid }}</UiTableCell>
                  <UiTableCell>{{ row.ppid }}</UiTableCell>
                  <UiTableCell class='pr-3'>{{ row.uid }}</UiTableCell>
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
