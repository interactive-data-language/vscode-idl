import { Injectable } from '@angular/core';
import {
  IDLNotebookRendererMessage,
  IDLNotebookRendererMessageType,
} from '@idl/notebooks/types';
import type { RendererContext } from 'vscode-notebook-renderer';

@Injectable({
  providedIn: 'any',
})
export class VSCodeRendererMessenger {
  /**
   * Renderer context from VSCode so we can send messages
   */
  private context!: RendererContext<any>;

  constructor() {
    if ('_vscodeContext' in window) {
      this.context = (window as any)._vscodeContext;
    }
  }

  /**
   * Method that tells us if we can post messages or not
   */
  canPostMessage() {
    return this.context.postMessage !== undefined;
  }

  /**
   * Posts message to notebook controller
   */
  postMessage<T extends IDLNotebookRendererMessageType>(
    message: IDLNotebookRendererMessage<T>
  ) {
    if (this?.context?.postMessage !== undefined) {
      this.context.postMessage(message);
    }
  }
}
