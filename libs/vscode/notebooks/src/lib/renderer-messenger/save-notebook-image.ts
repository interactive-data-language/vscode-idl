import {
  IDLNotebookEmbeddedItem,
  IDLNotebookImage_PNG,
} from '@idl/notebooks/types';
import { CleanPath } from '@idl/shared';
import { writeFileSync } from 'fs';
import * as vscode from 'vscode';

/**
 * Save image from a notebook
 */
export async function SaveNotebookImage(
  payload: IDLNotebookEmbeddedItem<IDLNotebookImage_PNG>
) {
  const res = await vscode.window.showSaveDialog({
    filters: {
      Images: ['png'],
    },
  });

  // make sure we found something
  if (res === undefined) {
    return;
  }

  // write files to disk
  writeFileSync(
    CleanPath(res.fsPath),
    Buffer.from(payload.item.data, 'base64')
  );
}
