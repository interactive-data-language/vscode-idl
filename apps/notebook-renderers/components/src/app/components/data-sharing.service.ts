import { Injectable } from '@angular/core';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
} from '@idl/notebooks/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class DataSharingService {
  /**
   * Observable with current data being shared
   */
  $embed = new BehaviorSubject<
    IDLNotebookEmbeddedItem<IDLNotebookEmbedType> | undefined
  >(undefined);

  /**
   * Called when we have a new item to be embedded
   */
  embed(data: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>) {
    this.$embed.next(data);
  }
}
