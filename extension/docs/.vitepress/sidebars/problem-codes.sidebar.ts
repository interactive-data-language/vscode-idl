import { DefaultTheme } from 'vitepress';
import { SidebarEntry } from './sidebars.interface';

/**
 * Sidebar entries for the FAQ
 */
export const PROBLEM_CODES_CODES: DefaultTheme.NavItemWithLink[] = [
  {
    text: '"not-closed"',
    link: '/problem-codes/codes/0.md',
  },
  {
    text: '"unexpected-closer"',
    link: '/problem-codes/codes/1.md',
  },
  {
    text: '"unknown-branch"',
    link: '/problem-codes/codes/2.md',
  },
  {
    text: '"after-main"',
    link: '/problem-codes/codes/3.md',
  },
  {
    text: '"embarrassing-token"',
    link: '/problem-codes/codes/4.md',
  },
  {
    text: '"embarrassing-file"',
    link: '/problem-codes/codes/5.md',
  },
  {
    text: '"todo"',
    link: '/problem-codes/codes/6.md',
  },
  {
    text: '"unknown-token"',
    link: '/problem-codes/codes/7.md',
  },
  {
    text: '"illegal-arrow"',
    link: '/problem-codes/codes/8.md',
  },
  {
    text: '"illegal-comma"',
    link: '/problem-codes/codes/9.md',
  },
  {
    text: '"illegal-colon"',
    link: '/problem-codes/codes/10.md',
  },
  {
    text: '"illegal-include"',
    link: '/problem-codes/codes/11.md',
  },
  {
    text: '"illegal-ternary"',
    link: '/problem-codes/codes/13.md',
  },
  {
    text: '"colon-in-func"',
    link: '/problem-codes/codes/14.md',
  },
  {
    text: '"colon-in-func-method"',
    link: '/problem-codes/codes/15.md',
  },
  {
    text: '"double-token"',
    link: '/problem-codes/codes/16.md',
  },
  {
    text: '"illegal-struct"',
    link: '/problem-codes/codes/17.md',
  },
  {
    text: '"illegal-paren"',
    link: '/problem-codes/codes/18.md',
  },
  {
    text: '"illegal-bracket"',
    link: '/problem-codes/codes/19.md',
  },
  {
    text: '"return-vals-pro"',
    link: '/problem-codes/codes/20.md',
  },
  {
    text: '"return-vals-func"',
    link: '/problem-codes/codes/21.md',
  },
  {
    text: '"return-vals-missing-func"',
    link: '/problem-codes/codes/22.md',
  },
  {
    text: '"duplicate-pro"',
    link: '/problem-codes/codes/23.md',
  },
  {
    text: '"duplicate-func"',
    link: '/problem-codes/codes/24.md',
  },
  {
    text: '"duplicate-pro-method"',
    link: '/problem-codes/codes/25.md',
  },
  {
    text: '"duplicate-func-method"',
    link: '/problem-codes/codes/26.md',
  },
  {
    text: '"duplicate-struct"',
    link: '/problem-codes/codes/27.md',
  },
  {
    text: '"reserved-pro"',
    link: '/problem-codes/codes/29.md',
  },
  {
    text: '"reserved-func"',
    link: '/problem-codes/codes/30.md',
  },
  {
    text: '"return-missing"',
    link: '/problem-codes/codes/31.md',
  },
  {
    text: '"routines-first"',
    link: '/problem-codes/codes/32.md',
  },
  {
    text: '"unclosed-main"',
    link: '/problem-codes/codes/33.md',
  },
  {
    text: '"empty-main"',
    link: '/problem-codes/codes/34.md',
  },
  {
    text: '"after-continuation"',
    link: '/problem-codes/codes/35.md',
  },
  {
    text: '"reserved-pro-method"',
    link: '/problem-codes/codes/36.md',
  },
  {
    text: '"reserved-func-method"',
    link: '/problem-codes/codes/37.md',
  },
  {
    text: '"bad-continue"',
    link: '/problem-codes/codes/66.md',
  },
  {
    text: '"bad-break"',
    link: '/problem-codes/codes/67.md',
  },
  {
    text: '"expected-statement"',
    link: '/problem-codes/codes/68.md',
  },
  {
    text: '"illegal-var-index"',
    link: '/problem-codes/codes/105.md',
  },
  {
    text: '"circular-include"',
    link: '/problem-codes/codes/106.md',
  },
];

/**
 * Sidebar entries for the problem codes section of the sidebar
 */
export const PROBLEM_CODES_SIDEBAR: SidebarEntry[] = [
  {
    text: 'About',
    link: '/problem-codes/',
  },
  {
    text: 'Configuration',
    link: '/problem-codes/configuration',
  },
  {
    text: 'Codes',
    items: PROBLEM_CODES_CODES.sort((a, b) =>
      a.text > b.text ? 1 : b.text > a.text ? -1 : 0
    ),
    collapsed: true,
  },
];
