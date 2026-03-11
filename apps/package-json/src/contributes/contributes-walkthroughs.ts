import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const WALKTHROUGHS = [
  {
    id: 'idl.welcome',
    title: 'Welcome to IDL for VS Code!',
    description: 'Get started with IDL in VS Code',
    steps: [
      {
        id: 'intro',
        title: 'About IDL for VS Code',
        description:
          'Welcome to the IDL extension for Visual Studio Code! This extension provides comprehensive support for IDL development, including AI support, syntax highlighting, debugging, notebooks, and more.',
        media: {
          markdown: 'extension/walkthrough/getting-started.md',
        },
      },
      {
        id: 'ask-copilot',
        title: 'Ask IDL Agent',
        description:
          'Get AI-powered assistance for your IDL code and questions.\n[Open Copilot Chat](command:workbench.action.chat.open)',
        media: {
          markdown: 'extension/walkthrough/ask-copilot.md',
        },
      },
      {
        id: 'create-notebook',
        title: 'Create an IDL Notebook',
        description:
          'Get started with interactive IDL development using notebooks.\n[Create New IDL Notebook](command:idl.notebooks.newNotebook)',
        media: {
          markdown: 'extension/walkthrough/create-notebook.md',
        },
      },
      {
        id: 'start-idl',
        title: 'Start an IDL Session',
        description:
          'Launch an interactive Console to run and debug IDL commands.\n[Start IDL](command:idl.debug.startIDL)',
        media: {
          markdown: 'extension/walkthrough/start-idl-session.md',
        },
      },
      {
        id: 'configure',
        title: 'Configure IDL Extension',
        description:
          'Set up your IDL installation path and preferences.\n[Open Settings](command:idl.client.viewSettings)',
        media: {
          markdown: 'extension/walkthrough/configure-idl.md',
        },
      },
      {
        id: 'view-docs',
        title: 'View IDL Documentation',
        description:
          'Access IDL language documentation and routine references.\n[Open Documentation](command:idl.docs.open)',
        media: {
          markdown: 'extension/walkthrough/view-docs.md',
        },
      },
    ],
  },
];

/**
 * Updates the package.json file for walkthroughs
 */
export function ProcessWalkthroughs(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each walkthrough
  for (let i = 0; i < WALKTHROUGHS.length; i++) {
    const walkthrough = WALKTHROUGHS[i];

    // verify each step has valid media
    for (let j = 0; j < walkthrough.steps.length; j++) {
      const step = walkthrough.steps[j];
      if (step.media && 'image' in step.media) {
        const url = join(process.cwd(), `${step.media.image}`);
        if (!existsSync(url)) {
          throw new Error(
            `walkthrough "${walkthrough.id}" step "${step.id}" missing image file where expected "${step.media.image}"`
          );
        }
      }
      if (step.media && 'markdown' in step.media) {
        const url = join(process.cwd(), `${step.media.markdown}`);
        if (!existsSync(url)) {
          throw new Error(
            `walkthrough "${walkthrough.id}" step "${step.id}" missing markdown file where expected "${step.media.markdown}"`
          );
        }
      }
    }
  }

  // add walkthroughs to package.json
  contrib['walkthroughs'] = WALKTHROUGHS;
}
