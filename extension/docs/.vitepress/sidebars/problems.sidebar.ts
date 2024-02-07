import { SidebarEntry } from './sidebars.interface';
import { PROBLEM_CODES_SIDEBAR } from './problem-codes.sidebar';

/**
 * Sidebar entries for the problem codes section of the sidebar
 */
export const PROBLEMS_SIDEBAR: SidebarEntry[] = [
  {
    text: 'About',
    link: '/problem-codes/',
  },
  {
    text: 'Configuration',
    link: '/problem-codes/configuration',
  },
  {
    text: 'Disabling with Comments',
    link: '/problem-codes/disabling_with_comments',
  },
  {
    text: 'Codes',
    items: PROBLEM_CODES_SIDEBAR.sort((a, b) =>
      a.text > b.text ? 1 : b.text > a.text ? -1 : 0
    ),
    collapsed: true,
  },
];
