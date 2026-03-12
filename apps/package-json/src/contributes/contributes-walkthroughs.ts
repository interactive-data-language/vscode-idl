import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

export const WALKTHROUGHS = [
  {
    id: 'idl.welcome',
    title: '%walkthrough.idl.title%',
    description: '%walkthrough.idl.description%',
    steps: [
      {
        id: 'intro',
        title: '%walkthrough.idl.steps.intro.title%',
        description: '%walkthrough.idl.steps.intro.description%',
        media: {
          markdown: 'extension/walkthrough/getting-started.md',
        },
      },
      {
        id: 'ask-copilot',
        title: '%walkthrough.idl.steps.askCopilot.title%',
        description: '%walkthrough.idl.steps.askCopilot.description%',
        media: {
          markdown: 'extension/walkthrough/ask-copilot.md',
        },
        completionEvents: ['onCommand:workbench.action.chat.open'],
      },
      {
        id: 'create-notebook',
        title: '%walkthrough.idl.steps.createNotebook.title%',
        description: '%walkthrough.idl.steps.createNotebook.description%',
        media: {
          markdown: 'extension/walkthrough/create-notebook.md',
        },
        completionEvents: ['onCommand:idl.notebooks.newNotebook'],
      },
      {
        id: 'start-idl',
        title: '%walkthrough.idl.steps.startIdl.title%',
        description: '%walkthrough.idl.steps.startIdl.description%',
        media: {
          markdown: 'extension/walkthrough/start-idl-session.md',
        },
        completionEvents: ['onCommand:idl.debug.startIDL'],
      },
      {
        id: 'configure',
        title: '%walkthrough.idl.steps.configure.title%',
        description: '%walkthrough.idl.steps.configure.description%',
        media: {
          markdown: 'extension/walkthrough/configure-idl.md',
        },
        completionEvents: ['onCommand:idl.client.viewSettings'],
      },
      {
        id: 'view-docs',
        title: '%walkthrough.idl.steps.viewDocs.title%',
        description: '%walkthrough.idl.steps.viewDocs.description%',
        media: {
          markdown: 'extension/walkthrough/view-docs.md',
        },
        completionEvents: ['onCommand:idl.docs.open'],
      },
    ],
  },
];

/**
 * Updates the package.json file for walkthroughs
 */
export function ProcessWalkthroughs(
  packageJSON: IPackageJSON,
  nls: IPackageNLS,
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each walkthrough
  for (let i = 0; i < WALKTHROUGHS.length; i++) {
    const walkthrough = WALKTHROUGHS[i];

    // make sure that our translation is correct for walkthrough title and description
    if (!VerifyNLS(walkthrough.title, nls)) {
      throw new Error(
        `Walkthrough at index ${i} has an invalid title of "${walkthrough.title}"`,
      );
    }
    if (!VerifyNLS(walkthrough.description, nls)) {
      throw new Error(
        `Walkthrough at index ${i} has an invalid description of "${walkthrough.description}"`,
      );
    }

    // verify each step has valid media and NLS keys
    for (let j = 0; j < walkthrough.steps.length; j++) {
      const step = walkthrough.steps[j];

      // verify NLS keys for step title and description
      if (!VerifyNLS(step.title, nls)) {
        throw new Error(
          `Walkthrough "${walkthrough.id}" step "${step.id}" has an invalid title of "${step.title}"`,
        );
      }
      if (!VerifyNLS(step.description, nls)) {
        throw new Error(
          `Walkthrough "${walkthrough.id}" step "${step.id}" has an invalid description of "${step.description}"`,
        );
      }

      if (step.media && 'image' in step.media) {
        const url = join(process.cwd(), `${step.media.image}`);
        if (!existsSync(url)) {
          throw new Error(
            `walkthrough "${walkthrough.id}" step "${step.id}" missing image file where expected "${step.media.image}"`,
          );
        }
      }
      if (step.media && 'markdown' in step.media) {
        const url = join(process.cwd(), `${step.media.markdown}`);
        if (!existsSync(url)) {
          throw new Error(
            `walkthrough "${walkthrough.id}" step "${step.id}" missing markdown file where expected "${step.media.markdown}"`,
          );
        }
      }
    }
  }

  // add walkthroughs to package.json
  contrib['walkthroughs'] = WALKTHROUGHS;
}
