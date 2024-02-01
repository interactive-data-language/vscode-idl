import { Component, Input, SkipSelf } from '@angular/core';
import {
  IDLNotebook_EmbedType,
  IDLNotebookEmbeddedItem,
} from '@idl/types/notebooks';

import { VSCodeRendererMessenger } from '../services/vscode-renderer-messenger.service';
import { DataSharingService } from './data-sharing.service';

@Component({
  selector: 'idl-base-renderer',
  template: ` <p>base works!</p> `,
  styles: [],
})
export class BaseRendererComponent<T extends IDLNotebook_EmbedType> {
  /**
   * Track if we set data or not
   */
  hasData = false;

  /**
   * True (correctly typed) item we are embedding
   */
  _embed!: IDLNotebookEmbeddedItem<T>;

  /**
   * Flag indicating if we can send messages to VSCode or not
   */
  canMessage = false;

  /**
   * Reference to the data service for our entry component
   */
  dataService: DataSharingService;

  /**
   * Reference to our VSCode messenger class
   */
  messenger: VSCodeRendererMessenger;

  /**
   * Item we are embedding
   *
   * Use set to we can properly type because the ngSwitch case does not
   * handle it well
   */
  @Input()
  set embed(item: IDLNotebookEmbeddedItem<IDLNotebook_EmbedType>) {
    this._embed = item as IDLNotebookEmbeddedItem<T>;
    this.hasData = true;
  }

  constructor(
    @SkipSelf() dataService: DataSharingService,
    messenger: VSCodeRendererMessenger
  ) {
    this.dataService = dataService;
    this.messenger = messenger;
    this.canMessage = messenger.canPostMessage();
  }
}
