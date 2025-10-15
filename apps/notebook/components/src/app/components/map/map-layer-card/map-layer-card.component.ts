import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  NotebookMapLayer,
  NotebookMapLayerType,
} from '../helpers/create-layers.interface';

@Component({
  selector: 'idl-map-layer-card',
  templateUrl: './map-layer-card.component.html',
  styles: [
    `
      @import 'styles.scss';

      .cdk-drag-preview {
        border: none;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
  standalone: false,
})
export class MapLayerCardComponent {
  /**
   * The layer we are displaying
   */
  @Input() layer!: NotebookMapLayer<NotebookMapLayerType>;

  /** Current opacity */
  opacity = 100;

  /**
   * Output event that is emitted when our frame changes
   */
  @Output() propChange = new EventEmitter<undefined>();

  /**
   * When opacity slider changes, callback
   */
  onOpacityChange(ev: Event) {
    // convert to number
    this.opacity = +(ev.target as HTMLInputElement).value;

    // save property for opacity
    this.layer.props.opacity = this.opacity / 100;

    // emit event that we changed
    this.propChange.emit();
  }
}
