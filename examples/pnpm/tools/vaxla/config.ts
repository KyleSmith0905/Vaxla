import { defineVaxlaConfig, colors } from "@vaxla/cli";
import { rmdirSync } from "node:fs";
import { join } from "node:path";

export default defineVaxlaConfig({
  port: 3000,
  externalLinks: {
    vaxla: {
      href: "https://vaxla.yskkyle.com",
    },
    "example.com": {
      href: "https://example.com",
      icon: "line-md:sun-rising-filled-loop",
    },
    google: {
      href: "https://google.com",
      name: "Google",
      icon: "gg:google",
    },
  },
  packages: {
    viteVanillaTs: {
      name: "Vite Vanilla TS",
      path: "./apps/vite-vanilla-ts",
      color: colors.red,
      link: {
        dev: {
          port: 5173,
          name: "Development Server",
        },
        preview: {
          port: 4173,
          name: "Preview Server",
        },
      },
      scripts: {
        dev: {
          command: { package: true, npm: "dev" }, // cd ./apps/vite-vanilla-ts && pnpm run dev
          icon: "lucide:code-xml",
        },
        build: {
          label: "build",
          command: { package: true, shell: "pnpm run build" }, // cd ./apps/vite-vanilla-ts && pnpm run build
          icon: "lucide:hammer",
        },
        preview: {
          label: "preview",
          command: "cd ./apps/vite-vanilla-ts && pnpm run preview", // cd ./apps/vite-vanilla-ts && pnpm run preview
          icon: "lucide:app-window",
        },
        "clear-dist": {
          command: {
            fn: async () => {
              console.log("1/2 About to clear dist.");
              rmdirSync(join(process.cwd(), "./apps/vite-vanilla-ts/dist"), {
                recursive: true,
              });
              console.log("2/2 Cleared dist.");
            },
          },
          icon: "hugeicons:folder-remove",
        },
        "infinite-logging": {
          label: "Infinite Logging",
          command: {
            fn: async () => {
              console.log("init");
              const start = performance.now();
              return new Promise(() => {
                setInterval(() => {
                  console.log(
                    `interval - ${(performance.now() - start).toFixed(2).padStart(8, "0")}`,
                  );
                }, 100);
              });
            },
          },
          icon: "lucide:hard-drive-download",
        },
        test: {
          label: "test",
          command: {
            fn: async () => {
              console.log("Test not implemented.");
            },
          },
        },
      },
    },
  },
});
