import idlJson from '../../language/syntaxes/idl.tmLanguage.json';
import idlLog from '../../language/syntaxes/idl-log.tmLanguage.json';

import { defineConfig } from 'vitepress';
import {
  ADVANCED_SIDEBAR,
  FAQ_SIDEBAR,
  GENERAL_SIDEBAR,
  NOTEBOOK_SIDEBAR,
  PROBLEM_CODES_SIDEBAR,
  TYPES_SIDEBAR,
} from './sidebars';

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
      { text: 'Getting Started', link: '/general/' },
      { text: 'Notebooks', link: '/notebooks/' },
      { text: 'Types', link: '/types/' },
    ],

    sidebar: [
      {
        text: 'Advanced',
        items: ADVANCED_SIDEBAR,
        link: '/advanced/',
        collapsed: true,
      },
      {
        text: 'General',
        items: GENERAL_SIDEBAR,
        link: '/general/',
      },
      {
        text: 'Notebooks',
        items: NOTEBOOK_SIDEBAR,
        link: '/notebooks/',
        collapsed: true,
      },
      {
        text: 'Problem Codes',
        items: PROBLEM_CODES_SIDEBAR,
        link: '/problem-codes/',
        collapsed: true,
      },
      {
        text: 'Type Detection and Code Comments',
        items: TYPES_SIDEBAR,
        link: '/types/',
        collapsed: true,
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
