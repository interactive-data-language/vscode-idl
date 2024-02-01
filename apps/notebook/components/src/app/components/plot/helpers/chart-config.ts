import {
  IDLNotebookEmbeddedItem,
  IDLNotebookPlot,
  IDLNotebookPlot_Properties,
} from '@idl/types/notebooks';
import copy from 'fast-copy';

/**
 * Default chart configuration for plots
 */
const DEFAULT_CONFIG: IDLNotebookPlot_Properties = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

/**
 * If we have an animation, custom overrides for default plot options
 */
const DEFAULT_ANIMATION_OPTIONS: IDLNotebookPlot_Properties = {
  animation: false,
  frameInterval: 1000,
};

/**
 * Configuration options that cannot be overridden by users
 */
const ALWAYS_THIS_CONFIG: IDLNotebookPlot_Properties = {
  responsive: true,
  maintainAspectRatio: true,
};

/**
 * Creates the configuration for our chart
 */
export function ChartConfig(
  embed: IDLNotebookEmbeddedItem<IDLNotebookPlot>,
  animation: boolean
) {
  /**
   * Copy our starting point for options
   */
  const options = copy(DEFAULT_CONFIG);

  /**
   * If we are an animation, tweak some options
   */
  if (animation) {
    Object.assign(options, DEFAULT_ANIMATION_OPTIONS);
  }

  /**
   * Check if we have options from our plot
   */
  if (embed.item.properties) {
    Object.assign(options, embed.item.properties);
  }

  // verify our constant options are set
  Object.assign(options, ALWAYS_THIS_CONFIG);

  // return options
  return options;
}
