import { Injectable, OnDestroy } from '@angular/core';
import {
  IDLNotebookFromRendererBaseMessage,
  IDLNotebookFromRendererMessage,
  IDLNotebookFromRendererMessageType,
  IDLNotebookOutputMetadata,
  IDLNotebookToRendererBaseMessage,
  IDLNotebookToRendererMessage,
  IDLNotebookToRendererMessageType,
} from '@idl/types/notebooks';
import {
  applyTheme,
  argbFromHex,
  themeFromSourceColor,
} from '@material/material-color-utilities';
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

  /**
   * Observable that emits when the VSCode theme changes
   *
   * Sends a boolean flag if dark theme or not
   */
  themeChange$ = new Subject<boolean>();

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
      this.context.onDidReceiveMessage(
        (
          msg: IDLNotebookToRendererBaseMessage<IDLNotebookToRendererMessageType>
        ) => {
          // update dark theme flag
          this.darkTheme = !document.body.classList.contains('vscode-light');

          // handle message
          switch (msg.type) {
            case 'theme-change':
              this.setMaterialTheme();
              break;
            default:
              break;
          }
          // IDLNotebookRendererMessageBase
          // if (msg.cellId === this.metadata.id) {
          //   this.messages$.next(msg);
          // }

          // send event
          this.themeChange$.next(this.darkTheme);
        }
      );
    }

    // set material theme
    this.setMaterialTheme();
  }

  /**
   * Sets theme for our material components
   *
   * https://www.npmjs.com/package/@material/material-color-utilities
   */
  setMaterialTheme() {
    const style = getComputedStyle(document.body);

    // Get the theme from a hex color
    const theme = themeFromSourceColor(
      argbFromHex(style.getPropertyValue('--vscode-activityBar-foreground'))
    );

    // Apply the theme to the body by updating custom properties for material tokens
    applyTheme(theme, { target: document.body, dark: this.darkTheme });
  }

  /**
   * Listen for destroy lifecycle to clean up
   */
  ngOnDestroy() {
    // clean up observable
    this.messages$.complete();
    this.themeChange$.complete();
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
