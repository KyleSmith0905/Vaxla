<script setup lang="ts">
import { ScriptStatus } from '~/utils/packages/types';
import { getCommandShellScript } from '@vaxla/shared/command';
import { useLocalStorage } from '@vueuse/core';
import { useScripts } from '~/composables/useScripts';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import UtilityTerminal from '~/components/utility/terminal.vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{ id?: string }>();
const { getScript, killScript } = useScripts();
const dayjs = useDayjs();

const date = useLocalStorage('terminal-date', false, { initOnMounted: true });
const script = computed(() => (props.id ? getScript(props.id) : undefined));
</script>
<template>
	<Card class="flex min-h-0 flex-grow flex-col">
		<CardHeader class="flex flex-row justify-between gap-2">
			<div class="flex w-fit flex-col gap-1.5">
				<CardTitle>Command Logs</CardTitle>
				<div v-if="script" class="flex gap-2">
					<Badge class="flex gap-2">
						<Icon icon="lucide:clock" />
						{{ dayjs(script?.createdAt).format('LT') }}
					</Badge>
					<Badge class="flex gap-2 font-mono">
						<Icon icon="lucide:terminal" />
						{{ getCommandShellScript({ dynamic: script.command }, 'packages/@vaxla/ui') }}
					</Badge>
					<Badge :variant="script?.status === ScriptStatus.Opened ? 'success' : 'destructive'" class='flex gap-2'>
						<Icon icon="lucide:stethoscope" />
						<template v-if="script?.status === ScriptStatus.Opened">Opened</template>
						<template v-else>Closed</template>
					</Badge>
				</div>
			</div>
			<div class="flex gap-2">
				<Button :variant="date ? 'default' : 'secondary'" size="icon" @click="date = !date"><Icon icon="lucide:clock" /></Button>
				<Button :disabled="script?.status !== ScriptStatus.Opened" variant="destructive" size="icon" @click="killScript(id)">
					<Icon icon="lucide:trash-2" />
				</Button>
			</div>
		</CardHeader>
		<CardContent class="min-h-0 px-0">
			<UtilityTerminal :logs="script?.logs ?? []" :date="date" />
		</CardContent>
	</Card>
</template>
