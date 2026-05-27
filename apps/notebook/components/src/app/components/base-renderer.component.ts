import { Component, inject, Input, OnDestroy } from '@angular/core';
import {
  IDLNotebook_EmbedType,
  IDLNotebookEmbeddedItem,
} from '@idl/types/notebooks';
import { Subscription } from 'rxjs';

import { VSCodeRendererMessenger } from '../services/vscode-renderer-messenger.service';
import { DataSharingService } from './data-sharing.service';

@Component({
  selector: 'idl-base-renderer',
  template: ` <p>base works!</p> `,
  styles: [],
})
export class BaseRendererComponent<T extends IDLNotebook_EmbedType>
  implements OnDestroy
{
  /**
   * True (correctly typed) item we are embedding
   */
  _embed!: IDLNotebookEmbeddedItem<T>;

  /**
   * Subscriptions that we need to clean up
   */
  _subscriptions = new Subscription();

  /**
   * Flag indicating if we can send messages to VSCode or not
   */
  canMessage = false;

  /**
   * Reference to the data service for our entry component
   */
  dataService = inject(DataSharingService, { skipSelf: true });

  /**
   * Track if we set data or not
   */
  hasData = false;

  /**
   * Reference to our VSCode messenger class
   */
  messenger = inject(VSCodeRendererMessenger);

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

  constructor() {
    this.canMessage = this.messenger.canPostMessage();
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
