export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: "Vaxla Documentation",
      description:
        "Development tool to manage complex developer environments and run commands. A UI for your CLI.",
      umami: {
        enable: true,
        dataWebsiteId: process.env.UMAMI_WEBSITE_ID,
      },
    },
    theme: {
      customizable: false,
      color: "zinc",
      radius: 0.5,
    },
    header: {
      title: "Documentation",
      showTitle: true,
      darkModeToggle: true,
      border: true,
      nav: [
        {
          title: "Docs",
          links: [
            {
              title: "Getting Started",
              to: "/getting-started",
              description:
                "A quick start guide to get your local environment hooked up to Vaxla.",
              icon: "lucide:rocket",
            },
            {
              title: "Commands",
              to: "/commands",
              description: "API reference for terminal commands.",
              icon: "lucide:terminal",
            },
          ],
        },
      ],
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/KyleSmith0905/vaxla",
          target: "_blank",
        },
      ],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    banner: {
      enable: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    footer: {
      credits: "Copyright © 2025",
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/KyleSmith0905/vaxla",
          target: "_blank",
        },
      ],
    },
    toc: {
      enable: true,
      title: "On This Page",
      links: [
        {
          title: "Star on GitHub",
          icon: "lucide:star",
          to: "https://github.com/KyleSmith0905/vaxla",
          target: "_blank",
        },
        {
          title: "Create Issues",
          icon: "lucide:circle-dot",
          to: "https://github.com/KyleSmith0905/vaxla/issues",
          target: "_blank",
        },
      ],
    },
    search: {
      enable: true,
      inAside: false,
    },
  } as DefaultConfig,
});
