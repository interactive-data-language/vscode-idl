import { Injectable } from '@angular/core';
import {
  IDLNotebook_EmbedType,
  IDLNotebookEmbeddedItem,
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
    IDLNotebookEmbeddedItem<IDLNotebook_EmbedType> | undefined
  >(undefined);

  /**
   * Called when we have a new item to be embedded
   */
  embed(data: IDLNotebookEmbeddedItem<IDLNotebook_EmbedType>) {
    this.$embed.next(data);
  }
}
