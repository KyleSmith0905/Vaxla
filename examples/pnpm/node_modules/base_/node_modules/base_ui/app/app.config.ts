import colors from "tailwindcss/colors";
import { ScriptType } from "~/utils/packages/types";

export default defineAppConfig<{
  packagesInfo: Record<
    string,
    {
      name: string;
      color: {
        "50": string;
        "100": string;
        "200": string;
        "300": string;
        "400": string;
        "500": string;
        "600": string;
        "700": string;
        "800": string;
        "900": string;
        "950": string;
      };
      link?: { port: number; name: string; path?: string }[];
      scripts: {
        label: string;
        command: string;
        type: ScriptType;
        icon: string;
      }[];
    }
  >;
}>({
  packagesInfo: {
    web: {
      name: "Web",
      color: colors.violet,
      link: [{ port: 21351, name: "Local Web" }],
      scripts: [
        {
          label: "Start Server",
          command: "start:web",
          type: ScriptType.Serve,
          icon: "lucide:cloud",
        },
        {
          label: "Start Emulator Server",
          command: "start:web:emulator",
          type: ScriptType.Serve,
          icon: "lucide:cloud-cog",
        },
        {
          label: "Run Playwright Test",
          command: "test",
          type: ScriptType.Execute,
          icon: "lucide-lab:hexagons-3",
        },
        {
          label: "Run Playwright Debug Test",
          command: "test:debug",
          type: ScriptType.Execute,
          icon: "lucide-lab:hexagons-7",
        },
      ],
    },
    admin: {
      name: "Admin",
      color: colors.blue,
      link: [{ port: 54267, name: "Local Admin" }],
      scripts: [
        {
          label: "Start Server",
          command: "start:admin",
          type: ScriptType.Serve,
          icon: "lucide:cloud",
        },
        {
          label: "Start Emulator Server",
          command: "start:admin:emulator",
          type: ScriptType.Serve,
          icon: "lucide:cloud-cog",
        },
      ],
    },
    app: {
      name: "App",
      color: colors.cyan,
      link: [{ port: 10651, name: "Local App" }],
      scripts: [
        {
          label: "Start Server",
          command: "start:app",
          type: ScriptType.Serve,
          icon: "lucide:cloud",
        },
        {
          label: "Start Emulator Server",
          command: "start:app:emulator",
          type: ScriptType.Serve,
          icon: "lucide:cloud-cog",
        },
        {
          label: "Build Android",
          command: "build:app:android",
          type: ScriptType.Execute,
          icon: "lucide-lab:elephant",
        },
      ],
    },
    stripe: {
      name: "Stripe Emulator",
      color: colors.purple,
      scripts: [
        {
          label: "Start Emulator Server",
          command: "initialize:stripe:emulator",
          type: ScriptType.Daemon,
          icon: "lucide:cloud-cog",
        },
      ],
    },
    firebase: {
      name: "Firebase Emulator",
      color: colors.orange,
      link: [{ port: 4001, name: "Firebase Emulator UI" }],
      scripts: [
        {
          label: "Start Emulator Server",
          command: "initialize:firebase:emulator",
          type: ScriptType.Serve,
          icon: "lucide:cloud-cog",
        },
        {
          label: "Start Emulator Server With Debug",
          command: "initialize:firebase:emulator:debug",
          type: ScriptType.Serve,
          icon: "lucide:cloud-rain",
        },
        {
          label: "Seed Emulator",
          command: "seed:firebase:emulator",
          type: ScriptType.Execute,
          icon: "lucide:flower-2",
        },
        {
          label: "Clear Emulator Data",
          command: "clear:firebase:emulator",
          type: ScriptType.Execute,
          icon: "lucide:trash-2",
        },
      ],
    },
    emails: {
      name: "Email Emulator",
      color: colors.green,
      link: [{ port: 17002, name: "Email Preview" }],
      scripts: [
        {
          label: "Start Emulator Server",
          command: "start:email",
          type: ScriptType.Serve,
          icon: "lucide:cloud-cog",
        },
      ],
    },
    shared: {
      name: "Shared",
      color: colors.yellow,
      scripts: [
        {
          label: "Watch Shared Folder",
          command: "start:shared",
          type: ScriptType.Daemon,
          icon: "lucide:cloud",
        },
      ],
    },
  },
});
