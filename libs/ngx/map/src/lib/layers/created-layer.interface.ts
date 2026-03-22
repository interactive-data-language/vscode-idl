import {
  LayerBounds,
  NotebookMapLayer,
  NotebookMapLayerType,
} from '../create-layers.interface';

/**
 * Created notebook layer
 */
export type CreatedLayerNotebookMapLayer<T extends NotebookMapLayerType> = {
  /**
   * Bounds of the layer
   */
  bounds?: LayerBounds;
  /**
   * Layer to display
   */
  notebookLayer: NotebookMapLayer<T>;
};
