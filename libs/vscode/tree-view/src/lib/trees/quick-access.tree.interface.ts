import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our additional actions
 */
export const ADDITIONAL_ACTIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.quickAccess.viewSettings.name,
    description:
      IDL_TRANSLATION.idl.tree.children.quickAccess.viewSettings.description,
    icon: 'settings.svg',
    commandName: IDL_COMMANDS.CLIENT.VIEW_SETTING,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.quickAccess.pickIDL.name,
    description:
      IDL_TRANSLATION.idl.tree.children.quickAccess.pickIDL.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.CONFIG.IDL_DIR_USER,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.quickAccess.openDocs.name,
    description:
      IDL_TRANSLATION.idl.tree.children.quickAccess.openDocs.description,
    icon: 'help_center.svg',
    commandName: IDL_COMMANDS.DOCS.OPEN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.quickAccess.fileBug.name,
    description:
      IDL_TRANSLATION.idl.tree.children.quickAccess.fileBug.description,
    icon: 'bug.svg',
    commandName: IDL_COMMANDS.CLIENT.REPORT_PROBLEM,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.quickAccess.viewLogs.name,
    description:
      IDL_TRANSLATION.idl.tree.children.quickAccess.viewLogs.description,
    icon: 'article.svg',
    commandName: IDL_COMMANDS.CLIENT.VIEW_LOGS,
  },
];
