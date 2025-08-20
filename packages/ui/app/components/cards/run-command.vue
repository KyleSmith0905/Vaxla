<script setup lang="ts">
import { nanoid } from 'nanoid';
import { useScripts } from '~/composables/useScripts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const command = ref('');
const props = defineProps<{ id?: string }>();
const emits = defineEmits<{ (e: 'command-entered', options: { command: string; id: string }): void }>();

const { runScript } = useScripts();

const runScriptWrapper = () => {
	const id = props.id ?? nanoid();
	emits('command-entered', { command: command.value, id });
	runScript({ id, command: command.value });
	command.value = '';
};
</script>
<template>
	<Card>
		<CardHeader>
			<CardTitle>Run Command</CardTitle>
		</CardHeader>
		<CardContent>
			<form @submit.prevent="runScriptWrapper()" class="flex gap-2">
				<Input v-model="command" placeholder="pnpm run start" />
				<Button size="icon" type="submit">
					<Icon icon="lucide:send" />
				</Button>
			</form>
		</CardContent>
	</Card>
</template>
