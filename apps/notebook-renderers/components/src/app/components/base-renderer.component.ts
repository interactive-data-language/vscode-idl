import { Component, Input } from '@angular/core';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
} from '@idl/notebooks/types';

@Component({
  selector: 'idl-base-renderer',
  template: ` <p>base works!</p> `,
  styles: [],
})
export class BaseRendererComponent<T extends IDLNotebookEmbedType> {
  /**
   * Track if we set data or not
   */
  hasData = false;

  /**
   * True (correctly typed) item we are embedding
   */
  _embed!: IDLNotebookEmbeddedItem<T>;

  /**
   * Item we are embedding
   *
   * Use set to we can properly type because the ngSwitch case does not
   * handle it well
   */
  @Input()
  set embed(item: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>) {
    this._embed = item as IDLNotebookEmbeddedItem<T>;
    this.hasData = true;
  }
}
