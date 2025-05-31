<script setup lang="ts">
import { getCommandShellScript } from '@vaxla/shared/command';
import { useVaxlaConfig } from '~/composables/useVaxlaConfig';
import { useScripts } from '~/composables/useScripts';
import Terminal from '~/components/cards/terminal.vue'

const route = useRoute();
const config = await useVaxlaConfig();

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
