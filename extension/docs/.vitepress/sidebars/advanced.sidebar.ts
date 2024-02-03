import { MIGRATIONS_SIDEBAR } from './migrations.sidebar';
import { SidebarEntry } from './sidebars.interface';

/**
 * Sidebar entries for the advanced section of the docs
 */
export const ADVANCED_SIDEBAR: SidebarEntry[] = [
  {
    text: 'About',
    link: '/advanced/',
  },
  {
    text: 'Customizing Themes',
    link: '/advanced/customizing_themes',
  },
  {
    text: 'ENVI and IDL Task Creation',
    link: '/advanced/task_creation',
  },
  {
    text: 'Variables Reference',
    link: '/advanced/variables_reference',
  },
  {
    text: 'Migrations',
    items: MIGRATIONS_SIDEBAR,
  },
];
