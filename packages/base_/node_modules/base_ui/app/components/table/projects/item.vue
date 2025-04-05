<script setup lang="ts">
import colors from "tailwindcss/colors";
import { ScriptType } from "~/utils/packages/types";

const appConfig = useAppConfig();

const props = defineProps<{
  package: (typeof appConfig.packagesInfo)[string];
  packageId: string;
}>();

const qrCodeModalOpen = ref<string | undefined>(undefined);

const links = computed(() => {
  return props.package.link?.map((link) => ({
    fullUrl: `http://localhost:${link.port}/${link.path ?? ""}`,
    id: `${link.port}/${link.path ?? ""}`,
    name: link.name,
  }));
});

const { sites } = useActiveUrl({
  id: props.packageId,
  sites: links.value?.map((e) => e.fullUrl),
});
</script>
<template>
  <div class="flex items-center justify-between px-2 gap-2">
    <div class="flex items-center gap-2">
      <div
        class="size-2 rounded-full border"
        :style="{
          backgroundColor: package.color[700],
          borderColor: package.color[500],
        }"
      />
      <p class="font-header font-bold">{{ package.name }}</p>
    </div>
    <template v-for="link of links ?? []">
      <UiTooltip>
        <UiTooltipTrigger as-child>
          <UiButton
            variant="outline"
            size="xs"
            :class="{
              'border-green-400 shadow shadow-green-400 bg-green-400/10 hover:bg-green-400/20':
                sites?.[link.fullUrl],
            }"
            as-child
          >
            <a :href="link.fullUrl" target="_blank">{{ link.name }}</a>
          </UiButton>
        </UiTooltipTrigger>
        <UiTooltipContent class="flex flex-col">
          <div class="flex items-center gap-2">
            <h1 class="font-bold text-base font-header">{{ link.name }}</h1>
            <UiButton size="xs" variant="link" class="text-zinc-500">
              <a :href="link.fullUrl" target="_blank">{{ link.fullUrl }}</a>
            </UiButton>
          </div>
          <div class="flex gap-1 pt-2">
            <UiButton
              @click="qrCodeModalOpen = link.id"
              size="xs"
              variant="secondary"
              class="w-fit"
              ><Icon name="lucide:qr-code" /> QR Code</UiButton
            >
          </div>
        </UiTooltipContent>
      </UiTooltip>
      <UiDialog
        :open="qrCodeModalOpen === link.id"
        @update:open="qrCodeModalOpen = undefined"
      >
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>QR Code</UiDialogTitle>
            <UiDialogDescription
              >Scan the QR code to access the website on all of your
              devices.</UiDialogDescription
            >
          </UiDialogHeader>
          <div class="border rounded-lg">
            <Qrcode
              :value="link.fullUrl"
              variant="rounded"
              :blackColor="colors.zinc[50]"
              :radius="8"
            />
          </div>
        </UiDialogContent>
      </UiDialog>
    </template>
  </div>
  <div class="flex justify-between px-2">
    <TableProjectsButtonRow
      :package="package"
      :package-id="packageId"
      :type="ScriptType.Serve"
    />
    <TableProjectsButtonRow
      :package="package"
      :package-id="packageId"
      :type="ScriptType.Daemon"
    />
    <TableProjectsButtonRow
      :package="package"
      :package-id="packageId"
      :type="ScriptType.Execute"
    />
  </div>
</template>
