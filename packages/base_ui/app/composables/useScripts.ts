import type { BaseScoreCommand } from 'base_shared';
import { getCommandDisplayName } from 'base_shared/command';
import { nanoid } from 'nanoid';
import { toast } from 'vue-sonner';
import { ScriptStatus, type ActiveScript } from '~/utils/packages/types';

const scripts = ref<ActiveScript[]>([]);
const loading = ref(true);

const getScriptIndex = (id: string) => scripts.value.findIndex((e) => e.id === id);
const getScript = (id: string) => scripts.value.find((e) => e.id === id);

const hydrateActiveScripts = async () => {
	const newScripts = await $fetch('/api/active-script');
	loading.value = false;

	scripts.value = newScripts.scripts.map((e) => ({
		command: e.command,
		createdAt: new Date(e.createdAt),
		id: e.id,
		logs: e.logs.map((e) => ({ date: new Date(e.date), text: e.text, type: e.type })),
		status: e.status,
	}));
};
hydrateActiveScripts();

watch(
	[scripts],
	([newScripts]) => {
		if (loading.value) return;
		$fetch('/api/active-script', {
			method: 'POST',
			body: { scripts: newScripts },
		});
	},
	{ deep: true }
);

const eventSource = ref<EventSource>();
if (import.meta.client) {
	eventSource.value = useServerEventsClient();
	eventSource.value.addEventListener('message', (msg) => {
		const data = JSON.parse(msg.data) as {
			id: string;
			message?: string;
			type?: ActiveScript['logs'][number]['type'];
			status?: ScriptStatus;
		};

		const scriptIndex = getScriptIndex(data.id);
		if (!scripts.value[scriptIndex]) return;

		if (data.message) {
			const logData = {
				text: data.message,
				date: new Date(),
				type: data.type,
			};
			scripts.value[scriptIndex].logs = scripts.value[scriptIndex].logs.concat(logData).slice(-100);
		}
		if (data.status) scripts.value[scriptIndex].status = data.status;
	});
}

export const useScripts = () => {
	const config = useBaseScoreConfig();

	const runScript = async (options: { id?: string } & ({ command: BaseScoreCommand } | { commandIndex: number; packageId?: string })) => {
		options.id ??= nanoid();

		const command = 'command' in options ? options.command : config.packages[options.packageId ?? '']?.scripts[options.commandIndex];
		if (!command) return;

		scripts.value = scripts.value
			.concat({
				command: command,
				packageId: 'packageId' in options ? options.packageId : undefined,
				commandIndex: 'commandIndex' in options ? options.commandIndex : undefined,
				id: options.id,
				status: ScriptStatus.Opened,
				logs: [],
				createdAt: new Date(),
			})
			.slice(-10);

		toast.success(`Running script ${getCommandDisplayName({ dynamic: command })}.`);

		await $fetch('/api/run-script', {
			method: 'POST',
			body: options,
			timeout: 1000,
		});
	};

	const killScript = async (id: string | undefined) => {
		if (id === undefined) return;
		await $fetch('/api/kill-script', { method: 'POST', body: { id } }).catch((error) => {
			toast('Error Occurred', { description: error.data.message });
		});
	};

	return { scripts, runScript, killScript, getScriptIndex, getScript };
};
