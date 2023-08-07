import { Injectable } from '@angular/core';
import type { RendererContext } from 'vscode-notebook-renderer';

@Injectable({
  providedIn: 'any',
})
export class VSCodeRendererMessenger {
  /**
   * Renderer context from VSCode so we can send messages
   */
  private context!: RendererContext<any>;

  /**
   * If we can send messaged
   */
  private canMessage = false;

  constructor() {
    if ('_vscodeContext' in window) {
      this.context = (window as any)._vscodeContext;
      this.canMessage = !!this.context.postMessage;
    }
  }
}
