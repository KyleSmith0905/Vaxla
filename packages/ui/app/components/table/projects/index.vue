<script lang="ts" setup>
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import GridCollection from '~/components/utility/grid-collection/index.vue'
import GridCollectionItem from '~/components/utility/grid-collection/item.vue'
import ProjectsItemTable from '~/components/table/projects/item.vue'

const appConfig = await useVaxlaConfig();
const { value: homeMode } = useSettings('homeDisplay');
</script>
<template>
	<div class="overflow-hidden rounded-b-lg">
		<GridCollection :items="Object.keys(appConfig.packages ?? {}).length" variant="card" :class="{'grid-cols-1': homeMode === 'detailed'}">
			<GridCollectionItem
				v-for="(server, serverId) in appConfig.packages"
				:class="{'flex flex-col gap-2 bg-card': true, 'py-2': homeMode === 'compact', 'py-4 px-2': homeMode === 'detailed'}">
				<ProjectsItemTable :package="server" :package-id="serverId" />
			</GridCollectionItem>
		</GridCollection>
	</div>
</template>
