import { getUserRootDirectory, getUiDirectory } from '@vaxla/shared';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	debug: true,
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	telemetry: {
		enabled: true,
	},

	sourcemap: false,

	devServer: {
		loadingTemplate: () => readFileSync(join(getUiDirectory(), './.vaxla/loading/index.html'), { encoding: 'utf-8' }),
	},

	alias: {
		'tailwindcss/colors': 'tailwindcss/colors.js',
		'dayjs/locale/en': 'dayjs/locale/en',
		'dayjs/plugin/utc': 'dayjs/plugin/utc',
		'dayjs/plugin/localizedFormat': 'dayjs/plugin/localizedFormat',
		'dayjs/plugin/relativeTime': 'dayjs/plugin/relativeTime',
		'dayjs/plugin/updateLocale': 'dayjs/plugin/updateLocale',
		'ansi-to-html': 'ansi-to-html',
		'@vaxla/shared': join(getUiDirectory(), './.vaxla/shared'),
		'qrcode-vue3': 'qrcode-vue3/src/QRCodeVue3.vue',
	},

	vite: {
		server: {
			fs: {
				allow: [getUserRootDirectory()],
			},
		},
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ['entities/lib/decode.js'],
		},
		build: {
			commonjsOptions: {
				include: [/node_modules/, /entities/],
			},
		},

		ssr: {
			noExternal: ['entities'],
		},
	},

	nitro: {
		noExternals: true,
	},

	ssr: false,
	css: ['./assets/css/tailwind.css'],
	modules: ['@nuxtjs/mdc', 'dayjs-nuxt', '@nuxt/devtools'],

	dayjs: {
		locales: ['en'],
		plugins: ['relativeTime', 'localizedFormat'],
		defaultLocale: 'en',
	},

	app: {
		head: {
			title: 'Vaxla',
			htmlAttrs: {
				class: 'h-full',
			},
			bodyAttrs: {
				class: 'font-body h-full',
			},
			link: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/vaxla-internal/favicon.ico',
				},
			],
		},
		rootAttrs: {
			class: 'h-full',
		},
	},
});
