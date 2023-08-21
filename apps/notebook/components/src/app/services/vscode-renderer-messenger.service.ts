import { Injectable, OnDestroy } from '@angular/core';
import {
  IDLNotebookFromRendererBaseMessage,
  IDLNotebookFromRendererMessage,
  IDLNotebookFromRendererMessageType,
  IDLNotebookOutputMetadata,
  IDLNotebookToRendererMessage,
} from '@idl/notebooks/types';
import { nanoid } from 'nanoid';
import { Subject } from 'rxjs';
import type { RendererContext } from 'vscode-notebook-renderer';

@Injectable({
  providedIn: 'any',
})
export class VSCodeRendererMessenger implements OnDestroy {
  /**
   * Renderer context from VSCode so we can send messages
   */
  private context!: RendererContext<any>;

  /**
   * The output ID of the cell
   */
  private metadata!: IDLNotebookOutputMetadata;

  /**
   * Observable for messages from VSCode
   *
   * All messages are filtered by our cell ID
   */
  messages$ = new Subject<IDLNotebookToRendererMessage>();

  /** If we have a light or dark theme */
  darkTheme = true;

  constructor() {
    // get messaging context
    if ('_vscodeContext' in window) {
      this.context = (window as any)._vscodeContext;
    }

    // get the ID of our output item
    if ('_vscodeCellOutputMetadata' in window) {
      this.metadata = (window as any)._vscodeCellOutputMetadata;
    }

    // flag if dark mode
    this.darkTheme = !document.body.classList.contains('vscode-light');

    // listen for messages
    if (
      this.canPostMessage() &&
      this.context.onDidReceiveMessage !== undefined
    ) {
      this.context.onDidReceiveMessage((msg: IDLNotebookToRendererMessage) => {
        if (msg.cellId === this.metadata.id) {
          this.messages$.next(msg);
        }
      });
    }
  }

  /**
   * Listen for destroy lifecycle to clean up
   */
  ngOnDestroy() {
    // clean up observable
    this.messages$.complete();
  }

  /**
   * Method that tells us if we can post messages or not
   */
  canPostMessage() {
    return (
      this.context.postMessage !== undefined && this.metadata !== undefined
    );
  }

  /**
   * Posts message to notebook controller
   */
  postMessage<T extends IDLNotebookFromRendererMessageType>(
    message: IDLNotebookFromRendererBaseMessage<T>
  ) {
    if (this?.context?.postMessage !== undefined) {
      const typed: IDLNotebookFromRendererMessage<T> = {
        messageId: nanoid(),
        cellId: this.metadata.id,
        ...message,
      };
      this.context.postMessage(typed);
    }
  }
}
