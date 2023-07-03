import {
  IndexingMessage,
  LanguageServerPayload,
} from '@idl/vscode/events/messages';

import { IDLIndexingStatusBar } from './idl-indexing-status-bar';

/**
 * Create a status bar item for indexing
 */
const INDEX_BAR = new IDLIndexingStatusBar();

/**
 * Listen for events from our language server
 */
export const ON_INDEX = (payload: LanguageServerPayload<IndexingMessage>) => {
  switch (payload.type) {
    case 'start':
      INDEX_BAR.startedIndexing();
      break;
    case 'finish':
      INDEX_BAR.finishedIndexing();
      break;
    default:
      break;
  }
};
