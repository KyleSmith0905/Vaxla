<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { ButtonVariants } from '../ui/button';

const props = defineProps<
	(
		| {
				process?: string;
		  }
		| {
				port?: string;
		  }
	) & {
		size?: ButtonVariants['size'];
	}
>();

const killPort = (signal: 'SIGKILL' | 'SIGTERM') => {
	$fetch('/api/process/kill-port', {
		method: 'POST',
		query: {
			process: 'process' in props ? props.process : undefined,
			port: 'port' in props ? props.port : undefined,
			signal: signal,
		},
		onResponse: (e) => {
			if (!e.response.ok) return;
			if (signal === 'SIGKILL') toast.success('Process forcefully terminated');
			else toast.success('Process gracefully terminated');
		},
		onResponseError: (e) => {
			const body = e.response._data.message;
			toast.error(body);
		},
	});
};
</script>

<template>
	<UiTooltip>
		<UiTooltipTrigger>
			<UiButton @click="killPort('SIGTERM')" variant="destructive" :size="props.size">
				<Icon name="lucide:heart-off" />
			</UiButton>
		</UiTooltipTrigger>
		<UiTooltipContent>Requests a process to terminate gracefully</UiTooltipContent>
	</UiTooltip>
	<UiTooltip>
		<UiTooltipTrigger>
			<UiButton @click="killPort('SIGKILL')" variant="destructive" :size="props.size">
				<Icon name="lucide:power-off" />
			</UiButton>
		</UiTooltipTrigger>
		<UiTooltipContent>Forces a process to terminate immediately</UiTooltipContent>
	</UiTooltip>
</template>
