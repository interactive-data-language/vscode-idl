import { DefaultTheme } from 'vitepress';

export type SidebarEntry =
  | DefaultTheme.NavItemWithLink
  | DefaultTheme.NavItemWithChildren;
