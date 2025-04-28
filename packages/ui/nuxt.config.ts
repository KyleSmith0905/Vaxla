import { getUserRootDirectory } from '@base_/shared';
import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	telemetry: {
		enabled: true,
	},

	alias: {
		'tailwindcss/colors': 'tailwindcss/colors.js',
		'dayjs/locale/en': 'dayjs/locale/en',
		'dayjs/plugin/utc': 'dayjs/plugin/utc',
		'dayjs/plugin/localizedFormat': 'dayjs/plugin/localizedFormat',
		'dayjs/plugin/relativeTime': 'dayjs/plugin/relativeTime',
		'dayjs/plugin/updateLocale': 'dayjs/plugin/updateLocale',
		'ansi-to-html': 'ansi-to-html',
	},

	vite: {
		server: {
			fs: {
				allow: [getUserRootDirectory()],
			},
		},
		optimizeDeps: {
			include: ['dayjs'],
		},
		plugins: [tailwindcss()],
	},
	css: ['./assets/css/tailwind.css'],
	modules: ['@brycesteve/nuxt-sse', 'shadcn-nuxt', '@nuxt/fonts', '@nuxt/content', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-qrcode'],

	qrcode: {
		options: {
			variant: {
				inner: 'circle',
				marker: 'rounded',
				pixel: 'rounded',
			},
			radius: 1,
			blackColor: 'currentColor',
			whiteColor: 'transparent',
		},
	},

	shadcn: {
		prefix: 'Ui',
		componentDir: './app/components/ui',
	},

	dayjs: {
		locales: ['en'],
		plugins: ['relativeTime', 'localizedFormat'],
		defaultLocale: 'en',
	},

	fonts: {
		families: [
			{ name: 'Geist', provider: 'google' },
			{ name: 'Catamaran', provider: 'google' },
			{ name: 'Geist Mono', provider: 'google' },
		],
	},

	app: {
		head: {
			title: 'BASE_',
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
					href: '/base_/favicon.ico',
				},
			],
		},
		rootAttrs: {
			class: 'h-full',
		},
	},
});
