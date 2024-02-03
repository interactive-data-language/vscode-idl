import {
  IDL_NOTEBOOK_MIME_TYPE,
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbeddedItems,
  IDLNotebookImage_AnimationFromPNGs,
  IDLNotebookImage_AnimationFromUris,
  IDLNotebookImage_FromURI,
  IDLNotebookImage_PNG,
  IDLNotebookMap,
  IDLNotebookMap_GeoJSON,
  IDLNotebookMap_GeoJSONFromUri,
  IDLNotebookMap_Image,
  IDLNotebookMap_ImageFromUri,
  IDLNotebookOutputMetadata,
} from '@idl/types/notebooks';
import { readFileSync } from 'fs';
import { nanoid } from 'nanoid';
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

    // create metadata for our cell
    const meta: IDLNotebookOutputMetadata = {
      id: nanoid(),
    };

    // get the specific item that we are going to embed, might overwrite below
    let embedThis = embed;

    /**
     * Handle cases where we need to pre-encode data so we can embed it in notebook file
     */
    switch (embed.type) {
      /**
       * Check if we have an image we are embedding from a URI on disk
       */
      case 'idlnotebookimage_fromuri': {
        /**
         * Strictly type
         */
        const toEmbed =
          embed as IDLNotebookEmbeddedItem<IDLNotebookImage_FromURI>;

        /**
         * Strictly type item we are actually embedding
         */
        const realEmbed: IDLNotebookEmbeddedItem<IDLNotebookImage_PNG> = {
          type: 'idlnotebookimage_png',
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
      case 'idlnotebookimage_animationfromuris': {
        /**
         * Strictly type
         */
        const toEmbed =
          embed as IDLNotebookEmbeddedItem<IDLNotebookImage_AnimationFromUris>;

        /**
         * Strictly type item we are actually embedding
         */
        const realEmbed: IDLNotebookEmbeddedItem<IDLNotebookImage_AnimationFromPNGs> =
          {
            type: 'idlnotebookimage_animationfrompngs',
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

      case 'idlnotebookmap': {
        /**
         * Strictly type
         */
        const toEmbed = embed as IDLNotebookEmbeddedItem<IDLNotebookMap>;

        /**
         * Map data that we need to embed
         */
        const mapData = toEmbed.item.data;

        // see if we need to load any map data from disk
        for (let j = 0; j < mapData.length; j++) {
          switch (true) {
            case mapData[j].type === 'idlnotebookmap_geojsonfromuri': {
              // typed value
              const typed = mapData[
                j
              ] as IDLNotebookEmbeddedItem<IDLNotebookMap_GeoJSONFromUri>;

              // typed replacement
              const replaceWith: IDLNotebookEmbeddedItem<IDLNotebookMap_GeoJSON> =
                {
                  type: 'idlnotebookmap_geojson',
                  item: {
                    geojson: readFileSync(typed.item.uri, 'utf-8'),
                    properties: typed.item.properties,
                  },
                };

              // replace
              mapData.splice(j, 1, replaceWith);
              break;
            }

            case mapData[j].type === 'idlnotebookmap_imagefromuri': {
              // typed value
              const typed = mapData[
                j
              ] as IDLNotebookEmbeddedItem<IDLNotebookMap_ImageFromUri>;

              // typed replacement

              const replaceWith: IDLNotebookEmbeddedItem<IDLNotebookMap_Image> =
                {
                  type: 'idlnotebookmap_image',
                  item: {
                    data: Buffer.from(readFileSync(typed.item.uri)).toString(
                      'base64'
                    ),
                    xsize: typed.item.xsize,
                    ysize: typed.item.ysize,
                    extents: typed.item.extents,
                  },
                };

              // replace
              mapData.splice(j, 1, replaceWith);
              break;
            }

            default:
              break;
          }
        }

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
      new vscode.NotebookCellOutput(
        [
          new vscode.NotebookCellOutputItem(
            Buffer.from(JSON.stringify(embedThis)),
            IDL_NOTEBOOK_MIME_TYPE
          ),
        ],
        meta
      )
    );
  }
}
