import type { VaxlaCommand, VaxlaConfig } from '@vaxla/shared';
import { getCommandDisplayName } from '@vaxla/shared/command';
import { nanoid } from 'nanoid';
import { toast } from 'vue-sonner';
import { ScriptStatus, type ActiveScript } from '~/utils/packages/types';
import { useServerEventsClient } from './useServerEventsClient';
import { useVaxlaConfig } from './useVaxlaConfig';

const scripts = ref<
	{
		package: VaxlaConfig['packages'][string] | null;
		packageId: string | null;
		commandId: string | null;
		command: ActiveScript['command'];
		createdAt: Date;
		id: string;
		logs: { date: Date; text: string; type: ActiveScript['logs'][number]['type'] }[];
		status: ScriptStatus;
	}[]
>([]);
const loading = ref(true);

const getScriptIndex = (id: string) => scripts.value.findIndex((e) => e.id === id);
const getScript = (id: string) => scripts.value.find((e) => e.id === id);

const hydrateActiveScripts = async () => {
	const newScripts: { scripts: ActiveScript[] } = await $fetch('/api/active-script');
	loading.value = false;

	const vaxlaConfig = await useVaxlaConfig();

	scripts.value = newScripts.scripts.map((e) => ({
		package: vaxlaConfig.value.packages[e.packageId!] || null,
		packageId: e.packageId ?? null,
		commandId: e.commandId ?? null,
		command: e.command,
		createdAt: e.createdAt,
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
	const runScript = async (options: { id?: string } & ({ command: VaxlaCommand } | { commandId: string; packageId?: string })) => {
		const vaxlaConfig = await useVaxlaConfig();

		options.id ??= nanoid();

		const command = 'command' in options ? options.command : vaxlaConfig.value.packages[options.packageId ?? '']?.scripts[options.commandId];
		if (!command) return;

		scripts.value = scripts.value
			.concat({
				package: 'packageId' in options ? vaxlaConfig.value.packages[options.packageId!] || null : null,
				packageId: 'packageId' in options ? (options.packageId ?? null) : null,
				commandId: 'commandId' in options ? options.commandId : null,
				command: command,
				createdAt: new Date(),
				id: options.id,
				logs: [],
				status: ScriptStatus.Opened,
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
