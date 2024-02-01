import { IDLNotebookEmbeddedItem } from './embeds/idl-notebook.embed.interface';
import { IDLNotebookImage_PNG } from './embeds/idl-notebook-image.embed.interface';

/**
 * Message when we want to save an animation
 */
export type SaveImageAnimationRendererMessage = 'save-animation';

/**
 * Message when we save to save an image
 */
export type SaveImageRendererMessage = 'save-image';

/**
 * All messages that we send
 */
export type IDLNotebookFromRendererMessageType =
  | SaveImageAnimationRendererMessage
  | SaveImageRendererMessage;

/**
 * Typed-payloads for renderer messages
 */
export type IDLNotebookFromRendererMessagePayload<
  T extends IDLNotebookFromRendererMessageType
> = T extends SaveImageRendererMessage
  ? IDLNotebookEmbeddedItem<IDLNotebookImage_PNG>
  : never;

/**
 * Data structure for notebook renderer messages
 */
export type IDLNotebookFromRendererBaseMessage<
  T extends IDLNotebookFromRendererMessageType
> = {
  /**
   * Type of the message
   */
  type: T;
  /**
   * Payload for the message
   */
  payload: IDLNotebookFromRendererMessagePayload<T>;
};

/**
 * Base message for messages to/from renderers
 */
export interface IDLNotebookRendererMessageBase {
  /**
   * The ID of the cell sending the message
   */
  cellId: string;
  /**
   * ID of the message
   */
  messageId: string;
}

/**
 * Message format for what we send from the renderer to the controller
 */
export interface IDLNotebookFromRendererMessage<
  T extends IDLNotebookFromRendererMessageType
> extends IDLNotebookFromRendererBaseMessage<T>,
    IDLNotebookRendererMessageBase {}

/**
 * Message format for what we send to a renderer
 */
export type IDLNotebookToRendererMessage = IDLNotebookRendererMessageBase;
