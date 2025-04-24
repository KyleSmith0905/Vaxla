<script setup lang="ts">
import { useSidebar } from '~/components/ui/sidebar';

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
	<UiSidebar variant="floating">
		<UiSidebarHeader class="border-b">
			<h1 class="px-2 font-mono text-lg font-bold">BASE_</h1>
		</UiSidebarHeader>
		<UiSidebarContent>
			<UiSidebarGroup v-for="group of navigation">
				<UiSidebarGroupLabel class="justify-between">
					<span>{{ group.title }}</span>
				</UiSidebarGroupLabel>
				<UiSidebarGroupContent>
					<UiSidebarMenu>
						<UiSidebarMenuItem v-for="item of group.items">
							<UiSidebarMenuButton asChild>
								<NuxtLink :href="item.link">
									<Icon :name="item.icon" />
									<span>{{ item.title }}</span>
								</NuxtLink>
							</UiSidebarMenuButton>
						</UiSidebarMenuItem>
					</UiSidebarMenu>
				</UiSidebarGroupContent>
			</UiSidebarGroup>
		</UiSidebarContent>
	</UiSidebar>
	<div
		:class="{
			'flex w-full min-w-0 transform flex-col gap-2 py-2 pr-2 transition-transform duration-200 max-md:pl-2': true,
			'pl-2': !open,
			'pl-0': open,
		}"
	>
		<header class="rounded-lg border border-sidebar-border bg-sidebar shadow">
			<UiSidebarTrigger class="absolute" />
			<UiBreadcrumb class="px-8 py-1">
				<UiBreadcrumbList>
					<UiBreadcrumbItem class="font-mono">BASE_</UiBreadcrumbItem>
					<template v-for="pathPart of path">
						<UiBreadcrumbSeparator />
						<UiBreadcrumbItem>
							<UiBreadcrumbPage>{{ pathPart }}</UiBreadcrumbPage>
						</UiBreadcrumbItem>
					</template>
				</UiBreadcrumbList>
			</UiBreadcrumb>
		</header>

		<main class="flex min-h-0 flex-grow flex-col gap-2">
			<slot />
		</main>
	</div>
</template>
