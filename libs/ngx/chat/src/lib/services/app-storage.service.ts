import { inject, Injectable } from '@angular/core';
import { ChatStateModel } from '@idl/types/chat';
import { Store } from '@ngxs/store';
import { get, set } from 'idb-keyval';
import { debounceTime } from 'rxjs/operators';

import { RestoreChatState } from '../state/chat.actions';
import { ChatState } from '../state/chat.state';

/** IndexedDB key used to persist chat state */
const CHAT_STATE_KEY = 'chat_state';

/** Time we wait to save chat after it updates */
const CHAT_SAVE_DEBOUNCE_MS = 300;

/**
 * Persists chat state to IndexedDB so sessions survive page reloads
 */
@Injectable({ providedIn: 'root' })
export class AppStorageService {
  /** Flag to disable storage service */
  private enabled = true;

  private readonly store = inject(Store);

  /**
   * Restore chat state from IndexedDB, then persist future changes
   */
  async init(): Promise<void> {
    if (!this.enabled) {
      return;
    }

    /**
     * Attempt to restore state, but check for errors
     */
    try {
      const saved = await get<Partial<ChatStateModel>>(CHAT_STATE_KEY);
      if (saved) {
        this.store.dispatch(new RestoreChatState(saved));
      }
    } catch (err) {
      console.error('Failed to restore chat state from IndexedDB:', err);
    }

    /**
     * Listen for state changes and persist to IndexDB as we go
     */
    this.store
      .select(ChatState.state)
      .pipe(debounceTime(CHAT_SAVE_DEBOUNCE_MS))
      .subscribe((state) => {
        // fire-and-forget, so failures need an explicit catch or they go unhandled
        set(CHAT_STATE_KEY, state).catch((err) => {
          console.error('Failed to persist chat state to IndexedDB:', err);
        });
      });
  }
}
