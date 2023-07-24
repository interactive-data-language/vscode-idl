import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our additional actions
 */
export const ADDITIONAL_ACTIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.additionalActions.pickIDL.name,
    description:
      IDL_TRANSLATION.idl.tree.children.additionalActions.pickIDL.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.CONFIG.IDL_DIR_USER,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.additionalActions.openWebview.name,
    description:
      IDL_TRANSLATION.idl.tree.children.additionalActions.openWebview
        .description,
    icon: 'tab.svg',
    commandName: IDL_COMMANDS.WEBVIEW.START,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.additionalActions.openDocs.name,
    description:
      IDL_TRANSLATION.idl.tree.children.additionalActions.openDocs.description,
    icon: 'help_center.svg',
    commandName: IDL_COMMANDS.DOCS.OPEN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.additionalActions.fileBug.name,
    description:
      IDL_TRANSLATION.idl.tree.children.additionalActions.fileBug.description,
    icon: 'bug.svg',
    commandName: IDL_COMMANDS.CLIENT.REPORT_PROBLEM,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.additionalActions.viewLogs.name,
    description:
      IDL_TRANSLATION.idl.tree.children.additionalActions.viewLogs.description,
    icon: 'article.svg',
    commandName: IDL_COMMANDS.CLIENT.VIEW_LOGS,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.additionalActions.viewSettings.name,
    description:
      IDL_TRANSLATION.idl.tree.children.additionalActions.viewSettings
        .description,
    icon: 'settings.svg',
    commandName: IDL_COMMANDS.CLIENT.VIEW_SETTING,
  },
];
