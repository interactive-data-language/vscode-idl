import { existsSync, readFileSync } from 'fs';
import { performance } from 'perf_hooks';
import * as vscode from 'vscode';

import { ICurrentCell } from '../idl-notebook-controller.interface';
import { MakeImageStyle } from './make-image-style';

/**
 * Adds an image to a cell
 */
export function AddAnimationToCell(
  cell: ICurrentCell,
  uris: string[],
  width: number,
  height: number
) {
  // return if nothing to do
  if (uris.length === 0) {
    return;
  }

  /**
   * get image style
   */
  const style = MakeImageStyle(width, height);

  // track encoded images
  const encoded: string[] = [];

  // encode all images, return if nothing
  for (let i = 0; i < uris.length; i++) {
    // return if a file is missing
    if (!existsSync(uris[i])) {
      return;
    }
    encoded.push(
      `data:image/png;base64,${Buffer.from(readFileSync(uris[i])).toString(
        'base64'
      )}`
    );
  }

  /**
   * Make an ID do that all variables are unique
   *
   * The rendered content shares the same global scope (which I think the vars below use)
   *
   * So we need to make them unique to one another
   */
  const id = Math.floor(performance.now() * 1000);

  // make new data variable
  const datVar = `data${id}`;
  const imgId = `img${id}`;
  const idxId = `idx${id}`;

  /**
   * Make HTML
   */
  const html = `
  <html>
  <body>
  <script type="text/javascript">
    // track which frame we are playing
    let ${idxId} = ${0};

    // base64 encoded PNG source data
    const ${datVar} = ${JSON.stringify(encoded)};

    // set first image
    document.getElementById("${imgId}").src = ${datVar}[${idxId}];

    // update image every second
    setInterval(() => {
      ${idxId} += 1;
      if (${idxId} >= ${datVar}.length) {
        ${idxId} = 0
      }
      document.getElementById("${imgId}").src = ${datVar}[${idxId}];
    }, 1000)
  </script>
  <img id="${imgId}" src="" ${style}>
  </body>
  </html>
  `;

  cell.execution.appendOutput(
    new vscode.NotebookCellOutput([
      /**
       * Use HTML because it works. Using the other mimetype *probably* works
       * but this works right now :)
       */
      new vscode.NotebookCellOutputItem(Buffer.from(html), 'text/html'),
    ])
  );

  // cell.execution.appendOutput(
  //   new vscode.NotebookCellOutput([
  //     /**
  //      * Use HTML because it works. Using the other mimetype *probably* works
  //      * but this works right now :)
  //      */
  //     new vscode.NotebookCellOutputItem(Buffer.from(JSON.stringify({uris,width,height})), 'idl/test-mime'),
  //   ])
  // );

  // return
}
