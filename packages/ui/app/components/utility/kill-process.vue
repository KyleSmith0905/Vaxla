<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { ButtonVariants } from '../ui/button';
import {Tooltip, TooltipTrigger, TooltipContent} from '~/components/ui/tooltip';
import { Button } from '../ui/button';
import { Icon } from '@iconify/vue';

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
	<Tooltip>
		<TooltipTrigger>
			<Button @click="killPort('SIGTERM')" variant="destructive" :size="props.size">
				<Icon icon="lucide:heart-off" />
			</Button>
		</TooltipTrigger>
		<TooltipContent>Requests a process to terminate gracefully</TooltipContent>
	</Tooltip>
	<Tooltip>
		<TooltipTrigger>
			<Button @click="killPort('SIGKILL')" variant="destructive" :size="props.size">
				<Icon icon="lucide:power-off" />
			</Button>
		</TooltipTrigger>
		<TooltipContent>Forces a process to terminate immediately</TooltipContent>
	</Tooltip>
</template>
