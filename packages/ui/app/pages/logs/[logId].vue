<script setup lang="ts">
import { getCommandShellScript } from '@base_/shared/command';

const route = useRoute();
const config = await useBaseScoreConfig();

const { getScript } = useScripts();
const script = computed(() => getScript(route.params.logId as string));

definePageMeta({
	layout: false,
});
</script>
<template>
	<NuxtLayout name="default" :path="['Logs', getCommandShellScript({ dynamic: script?.command }, config.packages[script?.packageId ?? '']?.path ?? '')]">
		<CardsTerminal :id="script?.id" />
	</NuxtLayout>
</template>
