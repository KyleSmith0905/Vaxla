export default {
	"packages": {
		"root": {
			"name": "root",
			"path": ".",
			"scripts": [
				{
					"label": "dev",
					"command": {
						"npm": "dev"
					}
				},
				{
					"label": "start",
					"command": {
						"npm": "start"
					}
				}
			]
		},
		"apps\\vite-vanilla-ts": {
			"name": "apps\\vite-vanilla-ts",
			"path": "apps\\vite-vanilla-ts",
			"scripts": [
				{
					"label": "dev",
					"command": {
						"npm": "dev"
					}
				},
				{
					"label": "build",
					"command": {
						"npm": "build"
					}
				},
				{
					"label": "preview",
					"command": {
						"npm": "preview"
					}
				}
			]
		}
	}
}