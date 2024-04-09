import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Vizing",
  tagline:
    "An omni interoperability environment built on advanced zk technology",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.vizing.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Orbiter-Vizing", // Usually your GitHub org/user name.
  projectName: "vizing-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Vizing",
      logo: {
        alt: "Vizing Logo",
        src: "img/docusaurus.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          // to: '/blog',
          href: "https://vizing.medium.com/",
          label: "Blog",
          position: "left",
        },
        {
          href: "https://github.com/Orbiter-Vizing/vizing-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "VizingDocs",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Medium",
              href: "https://vizing.medium.com/",
            },
            {
              label: "Discord",
              href: "https://discord.com/invite/vizing",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/vizing_l2",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              // to: '/blog',
              href: "https://vizing.medium.com/",
            },
            {
              label: "GitHub",
              href: "https://github.com/Orbiter-Vizing/vizing-docs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vizing, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
