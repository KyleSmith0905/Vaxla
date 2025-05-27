<script setup lang="ts">
import { getCommandShellScript } from '@base_/shared/command';
import { useBaseScoreConfig } from '~/composables/useBaseScoreConfig';
import { useScripts } from '~/composables/useScripts';
import Terminal from '~/components/cards/terminal.vue'

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
		<Terminal :id="script?.id" />
	</NuxtLayout>
</template>
