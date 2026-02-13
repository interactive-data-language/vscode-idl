import { IDLFileType } from '@idl/shared/extension';

import {
  ParseEventListener,
  ParseEventPayloadMap,
} from './on-parse-event-manager.interface';

/**
 * Event manager for parse events with strictly typed payloads
 */
export class OnParseEventManager {
  /**
   * Event listeners organized by file type
   */
  private listeners: {
    [T in IDLFileType]?: Set<ParseEventListener<T>>;
  } = {
    'idl-task': new Set(),
    'envi-task': new Set(),
  };

  /**
   * Remove all listeners for a specific file type
   *
   * @param fileType - The type of file to clear listeners for
   */
  clear<T extends IDLFileType>(fileType: T): void {
    if (fileType in this.listeners) {
      this.listeners[fileType].clear();
    }
  }

  /**
   * Remove all listeners for all file types
   */
  clearAll(): void {
    Object.keys(this.listeners).forEach((fileType) => {
      this.listeners[fileType].clear();
    });
  }

  /**
   * Emit a parse event with a strictly typed payload
   */
  emit<T extends IDLFileType>(
    fileType: T,
    payload: ParseEventPayloadMap[T]
  ): void {
    if (!(fileType in this.listeners)) {
      return;
    }

    // notify each listener
    this.listeners[fileType].forEach((listener) => {
      try {
        listener(payload);
      } catch (error) {
        console.error(
          `Error in parse event listener for type ${fileType}:`,
          error
        );
      }
    });
  }

  /**
   * Subscribe to parse events for a specific file type with type-safe payload
   *
   * Returns unsubscribe function
   */
  on<T extends IDLFileType>(
    fileType: T,
    listener: ParseEventListener<T>
  ): () => void {
    this.listeners[fileType].add(listener as any);

    // Return unsubscribe function
    return () => {
      this.listeners[fileType].delete(listener as any);
    };
  }
}
