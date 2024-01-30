import idlJson from '../../language/syntaxes/idl.tmLanguage.json';
import idlLog from '../../language/syntaxes/idl-log.tmLanguage.json';

import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'IDL for VSCode',
  description: 'Documentation for how to use IDL within VSCode',

  /**
   * For offline use, these should be enabled
   *
   * It breaks navigation if base us set to
   */
  // base: './',
  // mpa: true,

  /** Add the "." for relative link */
  head: [['link', { rel: 'icon', href: './assets/favicon-48x48.ico' }]],

  markdown: {
    /**
     * Register languages
     */
    languages: [idlJson as any, idlLog as any],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/index' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/interactive-data-language/vscode-idl',
      },
    ],

    logo: '/assets/idlicon-color.svg',

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
  },
});
