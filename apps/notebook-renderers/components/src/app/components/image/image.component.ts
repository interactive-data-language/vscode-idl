import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
  IDLNotebookEncodedPNG,
} from '@idl/notebooks/types';

/**
 * ID for notebook image selector
 */
export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

@Component({
  selector: 'idl-nb-image',
  templateUrl: './image.component.html',
  styles: [``],
})
export class ImageComponent implements OnInit, OnChanges {
  /**
   * Track if we set data or not
   */
  hasData = false;

  /**
   * Item we are embedding
   *
   * Use set to we can properly type because the ngSwitch case does not
   * handle it well
   */
  @Input({ required: true })
  embed!: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>;

  /**
   * True (correctly typed) item we are embedding
   */
  _embed!: IDLNotebookEmbeddedItem<IDLNotebookEncodedPNG>;

  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  ngOnInit() {
    console.log('message from me!');
    // this.src = 'Changed on init!';
    if (this.embed !== undefined) {
      this.hasData = true;
      this._embed = this
        .embed as IDLNotebookEmbeddedItem<IDLNotebookEncodedPNG>;
      this.src = `data:image/png;base64,${this._embed.item.data}`;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.src = 'On changes';
    if (this.embed) {
      this.hasData = true;
      this._embed = this
        .embed as IDLNotebookEmbeddedItem<IDLNotebookEncodedPNG>;
      this.src = `data:image/png;base64,${this._embed.item.data}`;
    }
  }
}
