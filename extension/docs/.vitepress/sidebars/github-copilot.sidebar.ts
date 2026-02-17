import { SidebarEntry } from './sidebars.interface';

/**
 * Sidebar entries for the notebooks section of the docs
 */
export const GITHUB_COPILOT_SIDEBAR: SidebarEntry[] = [
  {
    text: 'About',
    link: '/github-copilot/',
  },
  {
    text: 'Getting Started',
    link: '/github-copilot/getting-started/',
    items: [
      {
        text: 'Chat Basics',
        link: '/github-copilot/getting-started/chat-basics',
      },
      {
        text: 'Quick Start: IDL',
        link: '/github-copilot/getting-started/idl',
      },
      {
        text: 'Quick Start: ENVI',
        link: '/github-copilot/getting-started/envi',
      },
    ],
  },
  {
    text: 'FAQ',
    link: '/github-copilot/faq/',
    items: [
      {
        text: 'Agent Mode',
        link: '/github-copilot/faq/agent-mode',
      },
      {
        text: 'Auto-Retries',
        link: '/github-copilot/faq/auto-retries',
      },
      {
        text: 'Level of Detail',
        link: '/github-copilot/faq/level-of-detail',
      },
      {
        text: 'To-Do Lists',
        link: '/github-copilot/faq/to-do-lists',
      },
    ],
  },
];
