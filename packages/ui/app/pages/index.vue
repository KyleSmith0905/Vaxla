<script setup lang="ts">
const appConfig = useBaseScoreConfig();

const packagesInfo = computed(() => {
	return Object.entries(appConfig.packages ?? {});
});

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Home']">
		<CardsRunCommand />
		<UiCard>
			<UiCardHeader>
				<UiCardTitle>Packages</UiCardTitle>
				<UiCardDescription v-if="!packagesInfo || packagesInfo.length === 0">There are no packages.</UiCardDescription>
				<UiCardDescription v-else-if="packagesInfo.length === 1">There is 1 package.</UiCardDescription>
				<UiCardDescription v-else>There are {{ packagesInfo.length }} packages.</UiCardDescription>
			</UiCardHeader>
			<TableProjects />
		</UiCard>
	</NuxtLayout>
</template>
