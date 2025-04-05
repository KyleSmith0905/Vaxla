<script lang="ts" setup>
const appConfig = useAppConfig();
</script>
<template>
  <div class="rounded-b-lg overflow-hidden">
    <UtilityGridCollection
      :items="Object.keys(appConfig.packagesInfo).length"
      variant="card"
    >
      <UtilityGridCollectionItem
        v-for="(server, serverId) in appConfig.packagesInfo"
        class="flex flex-col gap-2 py-2 bg-card"
      >
        <TableProjectsItem :package="server" :package-id="serverId" />
      </UtilityGridCollectionItem>
    </UtilityGridCollection>
  </div>
</template>
