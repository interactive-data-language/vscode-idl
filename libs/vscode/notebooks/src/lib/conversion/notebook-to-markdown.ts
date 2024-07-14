import {
  IDL_NOTEBOOK_MIME_TYPE,
  IDLNotebook_EmbedType,
  IDLNotebookEmbeddedItem,
  IDLNotebookImage_PNG,
  IDLNotebookMap,
  IDLNotebookMap_Image,
} from '@idl/types/notebooks';
import { NotebookCellKind, NotebookDocument } from 'vscode';

import { CreateOutputText } from './create-output-text';

/**
 * Converts a notebook to a markdown file
 */
export async function NotebookToMarkdown(
  nb: NotebookDocument
): Promise<string[]> {
  /**
   * Array of strings for markdown
   */
  let markdown: string[] = [];

  /**
   * Get all notebook cells
   */
  const cells = nb.getCells();

  let nImages = 0;

  // process each cell
  for (let i = 0; i < cells.length; i++) {
    /**
     * Get the cell
     */
    const cell = cells[i];

    // determine the cell kind
    switch (true) {
      /**
       * Check for markdown cell
       */
      case cell.kind === NotebookCellKind.Markup:
        // add markdown directly
        markdown = markdown.concat(cell.document.getText().split(/\r?\n/g));

        // add new line
        markdown.push('');
        break;

      /**
       * Check for code cell
       */
      case cell.kind === NotebookCellKind.Code: {
        // add code cell for IDL
        markdown.push('```idl');
        markdown = markdown.concat(cell.document.getText().split(/\r?\n/g));
        markdown.push('```');

        // add new line
        markdown.push('');

        // check for outputs
        const outputs = cell.outputs;

        /** Track actual number of outputs */
        let nOut = 1;

        // process each output
        for (let j = 0; j < outputs.length; j++) {
          // get output items
          const outputItems = outputs[j].items;

          // process all outputs for each output
          for (let z = 0; z < outputItems.length; z++) {
            /** Get actual output item */
            const output = outputItems[z];

            /** Convert the output to string */
            const asString = Buffer.from(output.data).toString();

            /**
             * Check the mime type
             */
            if (output.mime === IDL_NOTEBOOK_MIME_TYPE) {
              /**
               * Get the embedded item, we only have one per output item
               */
              const embedded: IDLNotebookEmbeddedItem<IDLNotebook_EmbedType> =
                JSON.parse(asString);

              /**
               * Determine how to proceed
               */
              switch (embedded.type) {
                case 'idlnotebookimage_png':
                  // markdown.push(
                  //   `![](data:image/png;base64,${
                  //     (
                  //       embedded as IDLNotebookEmbeddedItem<IDLNotebookImage_PNG>
                  //     ).item.data
                  //   })`
                  // );
                  markdown.push(
                    CreateOutputText(
                      nOut,
                      (
                        embedded as IDLNotebookEmbeddedItem<IDLNotebookImage_PNG>
                      ).item.data,
                      'image'
                    )
                  );
                  // markdown.push(`![](./${nImages}.png)`);
                  // writeFileSync(
                  //   `C:\\Users\\znorman\\.idl\\vscode\\notebooks\\examples\\${nImages}.png`,
                  //   (embedded as IDLNotebookEmbeddedItem<IDLNotebookImage_PNG>)
                  //     .item.data
                  // );
                  markdown.push('');
                  nOut++;
                  nImages++;
                  break;
                case 'idlnotebookmap': {
                  const map =
                    embedded as IDLNotebookEmbeddedItem<IDLNotebookMap>;

                  /**
                   * Try to find an image
                   */
                  const firstImage = map.item.data.find(
                    (data) => data.type === 'idlnotebookmap_image'
                  ) as IDLNotebookEmbeddedItem<IDLNotebookMap_Image>;

                  // check if we found an image
                  if (firstImage) {
                    // markdown.push(`![](./${nImages}.png)`);
                    // writeFileSync(
                    //   `C:\\Users\\znorman\\.idl\\vscode\\notebooks\\examples\\${nImages}.png`,
                    //   firstImage.item.data
                    // );

                    // markdown.push(
                    //   `![](data:image/png;base64,${firstImage.item.data})`
                    // );
                    markdown.push(
                      CreateOutputText(nOut, firstImage.item.data, 'image')
                    );
                    markdown.push('');
                    nOut++;
                    nImages++;
                  }
                  break;
                }
                default:
                  break;
              }
            } else {
              markdown.push(
                CreateOutputText(
                  nOut,
                  asString.split(/\r?\n/g).join('\n'),
                  'text'
                )
              );
              // markdown.push('```');
              // markdown = markdown.concat(asString.split(/\r?\n/g));
              // markdown.push('```');
              markdown.push('');
              nOut++;
            }
          }
        }

        /**
         * Track if we embedded outputs
         */
        const embeddedOutputs = false;

        // add extra line if we embedded outputs
        if (embeddedOutputs) {
          markdown.push('');
        }
        break;
      }
      default:
        break;
    }
  }

  return markdown;
}
