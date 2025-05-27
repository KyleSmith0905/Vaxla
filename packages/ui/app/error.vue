<script setup lang="ts">
import type { NuxtError } from '#app'
import { SidebarProvider } from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';

const props = defineProps({error: Object as () => NuxtError})

const sidebarState = useCookie('sidebar:state');

const defaultOpen = computed(() => (typeof sidebarState.value === 'boolean' ? sidebarState.value : sidebarState.value === 'true'));
</script>

<template>
	<SidebarProvider :default-open="defaultOpen" @update:open="sidebarState = $event ? 'true' : 'false'" class="h-full">
		<NuxtLayout name="default" :path="['Error']">
      <Card>
        <CardHeader>
          <CardTitle>Error - {{props.error?.statusCode}}</CardTitle>
          <CardDescription>{{props.error?.message}}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button to='/'>To Home</Button>
        </CardFooter>
      </Card>
      <Card class='flex-grow'>
        <CardHeader>
          <CardTitle>Debugging</CardTitle>
        </CardHeader>
        <CardContent>
          <pre><code class='font-mono text-sm text-muted-foreground text-wrap'>{{props.error?.stack?.trim()}}</code></pre>
        </CardContent>
      </Card>
		</NuxtLayout>
	</SidebarProvider>
	<Toaster />
</template>