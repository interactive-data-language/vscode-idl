import { GetExtensionPath } from '@idl/shared';
import {
  IDL_PROBLEM_CODE_ALIAS_LOOKUP,
  IDL_PROBLEM_CODES,
} from '@idl/types/problem-codes';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Makes docs files for all of our problem codes for us
 */
export function MakeDocsFiles() {
  console.log('Makings docs files to verify everything is as it should be...');

  /**
   * Get the folder where our code files should go
   */
  const folder = GetExtensionPath('extension/docs/problem-codes/codes');

  /**
   * Get the problem codes
   */
  const codes = Object.values(IDL_PROBLEM_CODES);

  const strings: string[] = [
    `import { DefaultTheme } from 'vitepress';`,
    ``,
    `/**`,
    ` * Sidebar entries for all problem codes`,
    ` *`,
    ` * Generated automatically when we build our package.json file`,
    ` */`,
    `export const PROBLEM_CODES_SIDEBAR: DefaultTheme.NavItemWithLink[] = [`,
  ];

  /**
   * Make sure every file exists
   */
  for (let i = 0; i < codes.length; i++) {
    /** get problem code */
    const code = codes[i];

    /** Get the alias for the code */
    const alias = IDL_PROBLEM_CODE_ALIAS_LOOKUP[code];

    // add to our sidebar
    strings.push(`  {`);
    strings.push(`    text: '"${alias}"',`);
    strings.push(`    link: '/problem-codes/codes/${code}.md',`);
    strings.push(`  },`);

    /** get expected file */
    const expected = join(folder, `${code}.md`);

    /** Make a placeholder if it doesn't exist */
    if (!existsSync(expected)) {
      const content = [
        `# IDL Problem Code \`${code}\` with alias \`${alias}\``,
        ``,
        `::: info`,
        `Hey there!`,
        ``,
        `I'm a placeholder docs page. If you are looking for more information, make a quick feature request on [GitHub](https://github.com/interactive-data-language/vscode-idl/issues/new?assignees=&labels=type%3A+feature&projects=&template=2-feature.yml&title=%5BFeature%5D%3A+) and we will get this updated for you.`,
        `:::`,
        ``,
      ];

      // write to disk
      writeFileSync(expected, content.join('\n'));
    }
  }

  // close sidebar code
  strings.push(`];`);
  strings.push(``);

  /**
   * Get the folder where our code files should go
   */
  const sidebarFile = GetExtensionPath(
    'extension/docs/.vitepress/sidebars/problem-codes.sidebar.ts'
  );

  // write sidebar to disk
  writeFileSync(sidebarFile, strings.join('\n'));
}
