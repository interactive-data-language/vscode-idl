import idlJson from '../../language/syntaxes/idl.tmLanguage.json';
import idlLog from '../../language/syntaxes/idl-log.tmLanguage.json';

import { defineConfig } from 'vitepress';

import { TYPES_SIDEBAR } from './sidebars/types.sidebar';
import { ADVANCED_SIDEBAR } from './sidebars/advanced.sidebar';
import { CODE_COMMENTS_SIDEBAR } from './sidebars/code-comments.sidebar';
import { NOTEBOOK_SIDEBAR } from './sidebars/notebook.sidebar';
import { GETTING_STARTED_SIDEBAR } from './sidebars/getting-started.sidebar';
import { PROBLEMS_SIDEBAR } from './sidebars/problems.sidebar';
import { VERSION } from '../../../libs/shared/src/lib/version.interface';
import { SCRIPT, VSCODE_ICON } from './constants';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'IDL for VSCode',
  description: 'Documentation for how to use IDL within VSCode',

  /**
   * Files that we leave out
   */
  srcExclude: ['**/problem-codes/codes/severity/*.md'],

  /**
   * For offline use, these should be enabled
   *
   * It breaks navigation if base us set to
   */
  // base: './',
  // mpa: true,

  /** Add the "." for relative link */
  head: [
    // hosted
    ['link', { rel: 'icon', href: '/vscode-idl/assets/favicon-48x48.ico' }],

    // offline
    ['link', { rel: 'icon', href: '/assets/favicon-48x48.ico' }],

    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-013CSSSNJG',
      },
    ],

    [
      'script',
      {
        async: true,
        src: 'https://play.vidyard.com/embed/v4.js',
      },
    ],

    ['script', {}, SCRIPT],
  ],

  markdown: {
    /**
     * Register languages
     */
    languages: [idlJson as any, idlLog as any],

    /**
     * Re-name callouts to not be SCREAM CASE
     */
    container: {
      tipLabel: 'Pro Tip',
      warningLabel: 'Warning',
      dangerLabel: 'Danger',
      infoLabel: 'Information',
    },

    // line numbers in code blocks or not
    lineNumbers: true,

    /**
     * Code themes: https://shiki.style/themes#special-themes
     */
    theme: {
      light: 'light-plus',
      dark: 'dracula-soft',
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Notebooks', link: '/notebooks/' },
      { text: 'Types', link: '/types/' },
      {
        text: `v${VERSION}`,
        link: 'https://github.com/interactive-data-language/vscode-idl/blob/main/CHANGELOG.md',
      },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: GETTING_STARTED_SIDEBAR,
        // link: '/getting-started/',
      },
      {
        text: 'Notebooks',
        items: NOTEBOOK_SIDEBAR,
        // link: '/notebooks/',
        collapsed: true,
      },
      {
        text: 'Problem Codes',
        items: PROBLEMS_SIDEBAR,
        // link: '/problem-codes/',
        collapsed: true,
      },
      {
        text: 'Code Comments',
        items: CODE_COMMENTS_SIDEBAR,
        // link: '/code-comments/',
        collapsed: true,
      },
      {
        text: 'Type Detection',
        items: TYPES_SIDEBAR,
        // link: '/types/',
        collapsed: true,
      },
      {
        text: 'Advanced',
        items: ADVANCED_SIDEBAR,
        // link: '/advanced/',
        collapsed: true,
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/interactive-data-language/vscode-idl',
      },
      {
        icon: { svg: VSCODE_ICON },
        link: 'https://marketplace.visualstudio.com/items?itemName=IDL.idl-for-vscode',
      },
    ],

    footer: {
      message: 'Licensed under MIT.',
      copyright: 'Copyright (c) 2024, NV5 Geospatial Software, Inc.',
    },

    logo: '/assets/idlicon-color.svg',

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
  },
});
