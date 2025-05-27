<script setup lang="ts">
import { useBaseScoreConfig } from '~/composables/useBaseScoreConfig';
import RunCommand from '~/components/cards/run-command.vue';
import ProjectsTable from '~/components/table/projects/index.vue';
import { Card, CardHeader, CardDescription, CardTitle } from '~/components/ui/card';

const appConfig = await useBaseScoreConfig();

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
			<CardHeader>
				<CardTitle>Packages</CardTitle>
				<CardDescription v-if="!packagesInfo || packagesInfo.length === 0">There are no packages.</CardDescription>
				<CardDescription v-else-if="packagesInfo.length === 1">There is 1 package.</CardDescription>
				<CardDescription v-else>There are {{ packagesInfo.length }} packages.</CardDescription>
			</CardHeader>
			<ProjectsTable />
		</Card>
	</NuxtLayout>
</template>
