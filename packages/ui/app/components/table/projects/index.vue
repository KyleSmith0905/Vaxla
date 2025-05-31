<script lang="ts" setup>
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import GridCollection from '~/components/utility/grid-collection/index.vue'
import GridCollectionItem from '~/components/utility/grid-collection/item.vue'
import ProjectsItemTable from '~/components/table/projects/item.vue'

const appConfig = await useVaxlaConfig();
</script>
<template>
	<div class="overflow-hidden rounded-b-lg">
		<GridCollection :items="Object.keys(appConfig.packages ?? {}).length" variant="card">
			<GridCollectionItem v-for="(server, serverId) in appConfig.packages" class="flex flex-col gap-2 bg-card py-2">
				<ProjectsItemTable :package="server" :package-id="serverId" />
			</GridCollectionItem>
		</GridCollection>
	</div>
</template>
