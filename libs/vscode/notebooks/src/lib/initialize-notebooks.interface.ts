import { IDLNotebookController } from './controller/idl-notebook-controller.class';
import { IDLNotebookSerializer } from './serializer/idl-notebook-serializer.class';

/**
 * Result when we initialize notebooks
 */
export interface IInitializeNotebooks {
  /**
   * notebook controller that executes cells
   */
  controller: IDLNotebookController;
  /**
   * Serializer to load/save notebooks
   */
  serializer: IDLNotebookSerializer;
}
