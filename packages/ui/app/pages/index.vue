<script setup lang="ts">
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import RunCommand from '~/components/cards/run-command.vue';
import ProjectsTable from '~/components/table/projects/index.vue';
import { Card, CardDescription, CardTitle } from '~/components/ui/card';

const appConfig = await useVaxlaConfig();

const { value: homeMode } = useSettings('homeDisplay');

const packagesInfo = computed(() => {
	return Object.entries(appConfig.value.packages ?? {});
});

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Home']">
		<RunCommand />
		<Card>
			<div class='flex justify-between px-3 py-2'>
				<div class='flex flex-col gap-y-1.5'>
					<CardTitle>Packages</CardTitle>
					<CardDescription v-if="!packagesInfo || packagesInfo.length === 0">There are no packages.</CardDescription>
					<CardDescription v-else-if="packagesInfo.length === 1">There is 1 package.</CardDescription>
					<CardDescription v-else>There are {{ packagesInfo.length }} packages.</CardDescription>
				</div>
				<div>
					<UiButton @click="homeMode = homeMode === 'detailed' ? 'compact' : 'detailed'" variant="secondary" class="cursor-pointer">
						<Icon :icon='homeMode === "detailed" ? "lucide:gallery-vertical" : "lucide:grid-2x2"' />
						{{ homeMode === 'detailed' ? 'Detailed' : 'Compact' }}
					</UiButton>
				</div>
			</div>
			<ProjectsTable />
		</Card>
	</NuxtLayout>
</template>
