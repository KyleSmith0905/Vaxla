<script setup lang="ts">
import { useSidebar, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarGroupLabel, SidebarTrigger } from '~/components/ui/sidebar';
import { Icon } from '@iconify/vue'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '~/components/ui/breadcrumb'

defineProps<{ title?: string; path: string[] }>();

const { open } = useSidebar();

const navigation = [
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
</script>
<template>
	<Sidebar variant="floating">
		<SidebarHeader class="border-b">
			<h1 class="px-2 font-mono text-lg font-bold">BASE_</h1>
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
								<NuxtLink :href="item.link">
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
			'pl-2': !open,
			'pl-0': open,
		}"
	>
		<header class="rounded-lg border border-sidebar-border bg-sidebar shadow">
			<SidebarTrigger class="absolute" />
			<Breadcrumb class="px-8 py-1">
				<BreadcrumbList>
					<BreadcrumbItem class="font-mono">BASE_</BreadcrumbItem>
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
</template>
