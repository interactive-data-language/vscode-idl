import {
  IDLNotebookAnimationFromEncodedPNGs,
  IDLNotebookAnimationFromURIs,
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbeddedItems,
  IDLNotebookEncodedPNG,
  IDLNotebookImageFromURI,
} from '@idl/notebooks/types';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { ICurrentCell } from './idl-notebook-controller.interface';

/**
 * Takes the output from the `IDLNotebook.Export` method and creates the
 * appropriate notebook output for cells
 */
export function ProcessIDLNotebookEmbeddedItems(
  cell: ICurrentCell,
  items: IDLNotebookEmbeddedItems
) {
  // process each item
  for (let i = 0; i < items.length; i++) {
    // get the item we want to embed
    const embed = items[i];

    let embedThis = embed;

    /**
     * Handle cases where we need to pre-encode data so we can embed it in notebook file
     */
    switch (embed.type) {
      /**
       * Check if we have an image we are embedding from a URI on disk
       */
      case 'idlnotebookimagefromuri': {
        /**
         * Strictly type
         */
        const toEmbed =
          embed as IDLNotebookEmbeddedItem<IDLNotebookImageFromURI>;

        /**
         * Strictly type item we are actually embedding
         */
        const realEmbed: IDLNotebookEmbeddedItem<IDLNotebookEncodedPNG> = {
          type: 'idlnotebookencodedpng',
          item: {
            data: Buffer.from(readFileSync(toEmbed.item.uri)).toString(
              'base64'
            ),
            xsize: toEmbed.item.xsize,
            ysize: toEmbed.item.ysize,
          },
        };

        // update var with what we embed
        embedThis = realEmbed;
        break;
      }

      /**
       * Check if we have an animation we are embedding from files
       */
      case 'idlnotebookanimationfromuris': {
        /**
         * Strictly type
         */
        const toEmbed =
          embed as IDLNotebookEmbeddedItem<IDLNotebookAnimationFromURIs>;

        /**
         * Strictly type item we are actually embedding
         */
        const realEmbed: IDLNotebookEmbeddedItem<IDLNotebookAnimationFromEncodedPNGs> =
          {
            type: 'idlnotebookanimationfromencodedpngs',
            item: {
              data: toEmbed.item.uris.map((uri) =>
                Buffer.from(readFileSync(uri)).toString('base64')
              ),
              xsize: toEmbed.item.xsize,
              ysize: toEmbed.item.ysize,
            },
          };

        // update var with what we embed
        embedThis = realEmbed;
        break;
      }

      default:
        // do nothing
        break;
    }

    /**
     * Add as output with the appropriate mime type
     */
    cell.execution.appendOutput(
      new vscode.NotebookCellOutput([
        new vscode.NotebookCellOutputItem(
          Buffer.from(JSON.stringify(embedThis)),
          'idl/test-mime'
        ),
      ])
    );
  }
}
