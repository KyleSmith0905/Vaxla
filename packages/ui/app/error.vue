<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({error: Object as () => NuxtError})

const sidebarState = useCookie('sidebar:state');

const defaultOpen = computed(() => (typeof sidebarState.value === 'boolean' ? sidebarState.value : sidebarState.value === 'true'));
</script>

<template>
	<UiSidebarProvider :default-open="defaultOpen" @update:open="sidebarState = $event ? 'true' : 'false'" class="h-full">
		<NuxtLayout name="default" :path="['Error']">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Error - {{props.error?.statusCode}}</UiCardTitle>
          <UiCardDescription>{{props.error?.message}}</UiCardDescription>
        </UiCardHeader>
        <UiCardFooter>
          <UiButton to='/'>To Home</UiButton>
        </UiCardFooter>
      </UiCard>
      <UiCard class='flex-grow'>
        <UiCardHeader>
          <UiCardTitle>Debugging</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <pre><code class='font-mono text-sm text-muted-foreground text-wrap'>{{props.error?.stack?.trim()}}</code></pre>
        </UiCardContent>
      </UiCard>
		</NuxtLayout>
	</UiSidebarProvider>
	<UiToaster />
</template>