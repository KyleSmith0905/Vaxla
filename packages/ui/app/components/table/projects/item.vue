<script setup lang="ts">
import colors from 'tailwindcss/colors';

const appConfig = await useBaseScoreConfig();

const props = defineProps<{
	package: (typeof appConfig.value.packages)[string];
	packageId: string;
}>();

const qrCodeModalOpen = ref<string | undefined>(undefined);

const links = computed(() => {
	return props.package.link?.map((link) => ({
		fullUrl: `http://localhost:${link.port}/${link.path ?? ''}`,
		id: `${link.port}/${link.path ?? ''}`,
		name: link.name,
		port: link.port,
	}));
});

const { sites } = useActiveUrl({
	id: props.packageId,
	sites: links.value?.map((e) => e.fullUrl),
});
</script>
<template>
	<div class="flex items-start justify-between gap-2 px-2">
		<div class="flex items-center gap-2">
			<div
				class="size-2 rounded-full border"
				:style="{
					backgroundColor: package.color?.[700] ?? colors.neutral[700],
					borderColor: package.color?.[500] ?? colors.neutral[500],
				}"
			/>
			<p class="font-header font-bold">{{ package.name }}</p>
		</div>
		<div class="flex flex-wrap justify-end gap-2">
			<template v-for="link of links ?? []">
				<UiTooltip>
					<UiTooltipTrigger as-child>
						<UiButton
							variant="outline"
							size="xs"
							:class="{
								'border-green-400 bg-green-400/10 shadow shadow-green-400 hover:bg-green-400/20': sites?.[link.fullUrl],
							}"
							as-child
						>
							<a :href="link.fullUrl" target="_blank">{{ link.name }}</a>
						</UiButton>
					</UiTooltipTrigger>
					<UiTooltipContent class="flex flex-col">
						<div class="flex items-center gap-2">
							<h1 class="font-header text-base font-bold">{{ link.name }}</h1>
							<UiButton size="xs" variant="link" class="text-zinc-500">
								<a :href="link.fullUrl" target="_blank">{{ link.fullUrl }}</a>
							</UiButton>
						</div>
						<div class="flex gap-1 pt-2">
							<UiButton @click="qrCodeModalOpen = link.id" size="xs" variant="secondary" class="w-fit">
								<Icon name="lucide:qr-code" />
								QR Code
							</UiButton>
							<UtilityKillProcess v-if="sites?.[link.fullUrl]" :port="link.port" size="xs" />
						</div>
					</UiTooltipContent>
				</UiTooltip>
				<UiDialog :open="qrCodeModalOpen === link.id" @update:open="qrCodeModalOpen = undefined">
					<UiDialogContent>
						<UiDialogHeader>
							<UiDialogTitle>QR Code</UiDialogTitle>
							<UiDialogDescription>Scan the QR code to access the website on all of your devices.</UiDialogDescription>
						</UiDialogHeader>
						<div class="rounded-lg border">
							<Qrcode :value="link.fullUrl" variant="rounded" :blackColor="colors.zinc[50]" :radius="8" />
						</div>
					</UiDialogContent>
				</UiDialog>
			</template>
		</div>
	</div>
	<TableProjectsButtonRow :package="package" :package-id="packageId" />
</template>
