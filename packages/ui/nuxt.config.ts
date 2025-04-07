// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	telemetry: true,

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	alias: {
		'tailwindcss/colors': 'tailwindcss/colors.js',
	},

	modules: [
		'@brycesteve/nuxt-sse',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
		'shadcn-nuxt',
		'@nuxt/fonts',
		'@nuxt/content',
		'@nuxt/icon',
		'dayjs-nuxt',
		'@vueuse/nuxt',
		'nuxt-qrcode',
	],

	qrcode: {
		options: {
			variant: {
				inner: 'circle',
				marker: 'rounded',
				pixel: 'rounded',
			},
			radius: 1,
			blackColor: 'currentColor', // 'var(--ui-text-highlighted)' if you are using `@nuxt/ui` v3
			whiteColor: 'transparent', // 'var(--ui-bg)'
		},
	},

	tailwindcss: { cssPath: '~/assets/css/tailwind.css' },

	shadcn: {
		prefix: 'Ui',
		componentDir: './app/components/ui',
	},

	content: {
		contentHead: true,
		defaultLocale: 'en-US',
		navigation: {
			fields: ['description', 'author', 'publishedAt'],
		},
		markdown: {
			anchorLinks: false,
		},
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
				class: 'dark font-body h-full',
			},
		},
		rootAttrs: {
			class: 'h-full',
		},
	},
});
