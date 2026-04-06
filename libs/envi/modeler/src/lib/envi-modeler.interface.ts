import { ENVIModelerNode } from '@idl/types/envi/modeler';

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

/** Base X canvas coordinate used for auto-layout */
export const LAYOUT_BASE_X = 1200;

/** Base Y canvas coordinate used for auto-layout */
export const LAYOUT_BASE_Y = 1490;

/** Horizontal step between columns in auto-layout */
export const LAYOUT_STEP_X = 200;

/** Y offset applied to comment nodes relative to the base Y */
export const LAYOUT_COMMENT_Y_OFFSET = -90;

// ---------------------------------------------------------------------------
// Display name constants
// ---------------------------------------------------------------------------

/**
 * Fixed display names for structural node types.
 * Task nodes and other variable-name nodes use their task_name or display_name instead.
 */
export const FIXED_DISPLAY_NAMES: Partial<
  Record<ENVIModelerNode['type'], string>
> = {
  aggregator: 'Aggregator',
  datamanager: 'Data Manager',
  inputparameters: 'Input Parameters',
  iterator: 'Iterator',
  outputparameters: 'Output Parameters',
  view: 'View',
};
