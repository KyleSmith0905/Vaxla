<script lang="ts" setup>
const appConfig = useBaseScoreConfig();
</script>
<template>
	<div class="overflow-hidden rounded-b-lg">
		<UtilityGridCollection :items="Object.keys(appConfig.packages ?? {}).length" variant="card">
			<UtilityGridCollectionItem v-for="(server, serverId) in appConfig.packages" class="flex flex-col gap-2 bg-card py-2">
				<TableProjectsItem :package="server" :package-id="serverId" />
			</UtilityGridCollectionItem>
		</UtilityGridCollection>
	</div>
</template>
