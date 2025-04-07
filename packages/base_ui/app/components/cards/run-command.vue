<script setup lang="ts">
import { nanoid } from 'nanoid';

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
	<UiCard>
		<UiCardHeader>
			<UiCardTitle>Run Command</UiCardTitle>
		</UiCardHeader>
		<UiCardContent>
			<form @submit.prevent="runScriptWrapper()" class="flex gap-2">
				<UiInput v-model="command" placeholder="pnpm run start" />
				<UiButton size="icon" type="submit">
					<Icon name="lucide:send" />
				</UiButton>
			</form>
		</UiCardContent>
	</UiCard>
</template>
