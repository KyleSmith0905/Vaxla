<script setup lang="ts">
import colors from 'tailwindcss/colors';
import { useActiveUrl } from '~/composables/useActiveUrl';
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog';
import KillProcess from '~/components/utility/kill-process.vue';
import QrCode from 'qrcode-vue3';
import ProjectsButtonTableRow from './button-row.vue';

const appConfig = await useVaxlaConfig();
const { value: homeMode } = useSettings('homeDisplay');

const props = defineProps<{
	package: (typeof appConfig.value.packages)[string];
	packageId: string;
}>();

const qrCodeModalOpen = ref<string | undefined>(undefined);

const links = computed(() => {
	return Object.entries(props.package.link ?? {}).map(([id, link]) => ({
		fullUrl: `http://localhost:${link.port}/${link.path ?? ''}`,
		id: id,
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
	<div class="flex items-start justify-between gap-2 px-2" :class="{'flex-col': homeMode === 'detailed'}">
		<UtilityPackageName :package="package" />
		<div class="flex flex-wrap justify-end gap-2">
			<template v-for="link of links ?? []">
				<Tooltip>
					<TooltipTrigger as-child>
						<Button :variant="sites?.[link.fullUrl] ? 'success' : 'outline'" size="xs" as-child>
							<a :href="link.fullUrl" target="_blank">{{ link.name }}</a>
						</Button>
					</TooltipTrigger>
					<TooltipContent class="flex flex-col">
						<div class="flex items-center gap-2">
							<h1 class="text-base font-bold">{{ link.name }}</h1>
							<Button size="xs" variant="link" class="text-accent">
								<a :href="link.fullUrl" target="_blank">{{ link.fullUrl }}</a>
							</Button>
						</div>
						<div class="flex gap-1 pt-2">
							<Button @click="qrCodeModalOpen = link.id" size="xs" variant="secondary" class="w-fit">
								<Icon icon="lucide:qr-code" />
								QR Code
							</Button>
							<KillProcess v-if="sites?.[link.fullUrl]" :port="link.port" size="xs" side="bottom" />
						</div>
					</TooltipContent>
				</Tooltip>
				<Dialog :open="qrCodeModalOpen === link.id" @update:open="qrCodeModalOpen = undefined">
					<DialogContent>
						<DialogHeader>
							<DialogTitle>QR Code</DialogTitle>
							<DialogDescription>Scan the QR code to access the website on all of your devices.</DialogDescription>
						</DialogHeader>
						<div class="overflow-hidden rounded-lg border">
							<QrCode
								v-if="link.fullUrl"
								:width="512"
								:height="512"
								:value="link.fullUrl"
								:key="link.fullUrl"
								:qr-options="{
									errorCorrectionLevel: 'H',
								}"
								:dotsOptions="{
									color: colors.zinc[50],
									type: 'square',
								}"
								:backgroundOptions="{
									color: colors.zinc[950],
								}"
								:cornersSquareOptions="{
									color: colors.zinc[50],
									type: 'square',
								}"
								class="max-w-96"
							/>
						</div>
					</DialogContent>
				</Dialog>
			</template>
		</div>
	</div>
	<ProjectsButtonTableRow :package="package" :package-id="packageId" />
</template>
