import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { inferVaxlaConfig } from "@vaxla/cli/utilities/config";
import { resolve } from "path";
import { chdir, cwd } from "process";

describe("Config Inference", () => {
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = cwd();
  });

  afterEach(() => {
    chdir(originalCwd);
  });

  test("Path defined by CLI", async () => {
    // We are using the package-json fixture because this should take precedence.
    const fixturePath = resolve(__dirname, "../fixtures/package-json-config");
    chdir(fixturePath);

    const config = await inferVaxlaConfig({
      configPath: "cli-specified-vaxla",
    });
    expect(config.config.name).toBe("Vaxla From CLI");
  });

  test("Path defined by package.json", async () => {
    const fixturePath = resolve(__dirname, "../fixtures/package-json-config");
    chdir(fixturePath);

    const config = await inferVaxlaConfig();
    expect(config.config.name).toBe("Vaxla From package.json");
  });

  test("Path defined by common location (/vaxla)", async () => {
    const fixturePath = resolve(
      __dirname,
      "../fixtures/common-location-config",
    );
    chdir(fixturePath);

    const config = await inferVaxlaConfig();
    expect(config.config.name).toBe("Vaxla From Common Location");
  });

  test("Path defined by common nested location (/tools/vaxla)", async () => {
    const fixturePath = resolve(
      __dirname,
      "../fixtures/nested-common-location-config",
    );
    chdir(fixturePath);

    const config = await inferVaxlaConfig();
    expect(config.config.name).toBe("Vaxla From Secondary Common Location");
  });

  test("Path defined by common parent location", async () => {
    const fixturePath = resolve(
      __dirname,
      "../fixtures/common-location-config/web",
    );
    chdir(fixturePath);

    const config = await inferVaxlaConfig();
    expect(config.config.name).toBe("Vaxla From Common Location");
  });

  test("Default configuration generation", async () => {
    const fixturePath = resolve(__dirname, "../fixtures/config-generation");
    chdir(fixturePath);

    const config = await inferVaxlaConfig({ forceGeneration: true });
    expect(config.config.packages).toEqual({
      shared: {
        name: "shared",
        path: "shared",
        scripts: {
          build: {
            label: "build",
            command: {
              npm: "vite build",
            },
          },
        },
      },
      "apps/web": {
        name: "web",
        path: "apps/web",
        scripts: {
          start: {
            label: "start",
            command: {
              npm: "vite",
            },
          },
          build: {
            label: "build",
            command: {
              npm: "vite build",
            },
          },
        },
      },
    });
  });
});
