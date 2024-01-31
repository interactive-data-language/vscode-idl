import { FAQ_SIDEBAR } from './faq.sidebar';
import { SidebarEntry } from './sidebars.interface';

/**
 * Sidebar entries for the general section of our docs
 */
export const GENERAL_SIDEBAR: SidebarEntry[] = [
  {
    text: 'About',
    link: '/getting-started/',
  },
  {
    text: 'FAQ',
    items: FAQ_SIDEBAR,
    collapsed: true,
  },
  {
    text: 'IDL-Python Bridge',
    link: '/getting-started/idl_python_bridge',
  },
  {
    text: 'Usage Metrics',
    link: '/getting-started/usage_metrics',
  },
];
