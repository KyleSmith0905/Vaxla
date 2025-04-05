<script setup lang="ts">
import { useSidebar } from "~/components/ui/sidebar";

defineProps<{ title?: string; path: string[] }>();

const { open } = useSidebar();

const navigation = [
  {
    title: "Primary",
    items: [
      { title: "Home", link: "/", icon: "lucide:home" },
      { title: "Logs", link: "/logs", icon: "lucide:receipt-text" },
      { title: "Terminal", link: "/terminal", icon: "lucide:square-terminal" },
      { title: "Blogs", link: "/blogs", icon: "lucide:notebook" },
    ],
  },
  {
    title: "Tools",
    items: [
      { title: "QR Generator", link: "/qr-generator", icon: "lucide:qr-code" },
      {
        title: "Base Conversions",
        link: "/base-conversions",
        icon: "lucide:hash",
      },
      { title: "Processes", link: "/processes", icon: "lucide:monitor-cog" },
      { title: "Experiments", link: "/experiments", icon: "lucide:flask-conical" },
    ],
  },
];
</script>
<template>
  <UiSidebar variant="floating">
    <UiSidebarHeader class='border-b'>
      <h1 class="text-lg font-bold px-2 font-mono">BASE_</h1>
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
      'transform transition-transform duration-200 flex flex-col gap-2 w-full py-2 pr-2 min-w-0 max-md:pl-2': true,
      'pl-2': !open,
      'pl-0': open,
    }"
  >
    <header class="bg-sidebar border-sidebar-border border shadow rounded-lg">
      <UiSidebarTrigger class="absolute" />
      <UiBreadcrumb class="px-8 py-1">
        <UiBreadcrumbList>
          <UiBreadcrumbItem class='font-mono'>BASE_</UiBreadcrumbItem>
          <template v-for="pathPart of path">
            <UiBreadcrumbSeparator />
            <UiBreadcrumbItem>
              <UiBreadcrumbPage>{{ pathPart }}</UiBreadcrumbPage>
            </UiBreadcrumbItem>
          </template>
        </UiBreadcrumbList>
      </UiBreadcrumb>
    </header>

    <main class="flex flex-col gap-2 flex-grow min-h-0">
      <slot />
    </main>
  </div>
</template>
