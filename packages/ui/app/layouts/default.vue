<script setup lang="ts">
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarHeader,
	SidebarGroupLabel,
	SidebarTrigger,
} from '~/components/ui/sidebar';
import { Icon } from '@iconify/vue';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '~/components/ui/breadcrumb';
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import { SidebarProvider } from '~/components/ui/sidebar';

const sidebarState = useCookie('sidebar:state');
const defaultOpen = computed(() => (typeof sidebarState.value === 'boolean' ? sidebarState.value : sidebarState.value === 'true'));

defineProps<{ title?: string; path: string[] }>();

const config = await useVaxlaConfig();

const navigation = computed(() => {
	const items = [
		{
			title: 'Primary',
			items: [
				{ title: 'Home', link: '/', icon: 'lucide:home' },
				{ title: 'Logs', link: '/logs', icon: 'lucide:receipt-text' },
				{ title: 'Terminal', link: '/terminal', icon: 'lucide:square-terminal' },
				{ title: 'Articles', link: '/articles', icon: 'lucide:newspaper' },
				{ title: 'Settings', link: '/settings', icon: 'lucide:settings' },
			],
		},
		{
			title: 'Tools',
			items: [
				{ title: 'QR Generator', link: '/qr-generator', icon: 'lucide:qr-code' },
				{
					title: 'Base Conversions',
					link: '/base-conversions',
					icon: 'lucide:hash',
				},
				{ title: 'Processes', link: '/processes', icon: 'lucide:monitor-cog' },
			],
		},
	];

	if (config.value.externalLinks) {
		items.push({
			title: 'External',
			items: Object.entries(config.value.externalLinks ?? {}).map(([id, link]) => ({
				title: link.name ?? id,
				link: link.href,
				icon: link.icon ?? 'lucide:link',
			})),
		});
	}

	return items;
});

const isTauri = '__TAURI_INTERNALS__' in globalThis;
</script>
<template>
	<div class="flex h-full w-full flex-col">
		<!-- TODO: Remove from `main` branch -->
		<!-- <div v-if="isTauri" data-tauri-drag-region class="border-sidebar-border flex h-8 items-center border-b">
			<h1 class="px-2 text-sm">Vaxla Desktop</h1>
			<div class="ml-auto flex items-center">
				<button class="hover:bg-sidebar-accent flex h-8 w-8 items-center justify-center" @click="getCurrentWindow().minimize()">
					<Icon icon="mdi:window-minimize" />
				</button>
				<button class="hover:bg-sidebar-accent flex h-8 w-8 items-center justify-center" @click="getCurrentWindow().toggleMaximize()">
					<Icon icon="mdi:window-maximize" />
				</button>
				<button class="hover:bg-destructive hover:text-destructive-foreground flex h-8 w-8 items-center justify-center" @click="getCurrentWindow().close()">
					<Icon icon="mdi:close" />
				</button>
			</div>
		</div> -->
		<div class="relative flex flex-grow">
			<SidebarProvider :default-open="defaultOpen" @update:open="sidebarState = $event ? 'true' : 'false'" class="relative h-full">
				<Sidebar variant="floating" class="absolute h-full pr-0">
					<SidebarHeader class="border-b">
						<h1 class="px-2 font-mono text-lg font-bold">Vaxla</h1>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup v-for="group of navigation">
							<SidebarGroupLabel class="justify-between">
								<span>{{ group.title }}</span>
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem v-for="item of group.items">
										<SidebarMenuButton asChild>
											<NuxtLink :href="item.link" :target="item.link.startsWith('http') ? '_blank' : undefined">
												<Icon :icon="item.icon" />
												<span>{{ item.title }}</span>
											</NuxtLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
				<div
					:class="{
						'flex w-full min-w-0 transform flex-col gap-2 py-2 pr-2 transition-transform duration-200 max-md:pl-2': true,
						'pl-2': sidebarState !== 'true',
						'pl-0': sidebarState === 'true',
					}"
				>
					<header class="border-sidebar-border bg-sidebar rounded-lg border shadow">
						<SidebarTrigger class="absolute" />
						<Breadcrumb class="px-8 py-1">
							<BreadcrumbList>
								<BreadcrumbItem class="font-mono">Vaxla</BreadcrumbItem>
								<template v-for="pathPart of path">
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>{{ pathPart }}</BreadcrumbPage>
									</BreadcrumbItem>
								</template>
							</BreadcrumbList>
						</Breadcrumb>
					</header>

					<main class="flex min-h-0 flex-grow flex-col gap-2">
						<slot />
					</main>
				</div>
			</SidebarProvider>
		</div>
	</div>
</template>
