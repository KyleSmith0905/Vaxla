declare module "nuxt/schema" {
  interface AppConfig {
    packagesInfo: Record<
      string,
      {
        name: string;
        color: Record<
          | "50"
          | "100"
          | "200"
          | "300"
          | "400"
          | "500"
          | "600"
          | "700"
          | "800"
          | "900"
          | "950",
          string
        >;
        link?: { port: number; path?: `/${string}`; name: string }[];
        package?: PackageInfo;
        scripts: Script[];
      }
    >;
  }
}

export {};
