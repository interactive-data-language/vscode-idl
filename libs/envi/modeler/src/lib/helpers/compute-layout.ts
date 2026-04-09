import { ENVIModelerNode } from '@idl/types/mcp';

import {
  LAYOUT_BASE_X,
  LAYOUT_BASE_Y,
  LAYOUT_COMMENT_Y_OFFSET,
  LAYOUT_RIGHT_STEP_Y,
  LAYOUT_STEP_X,
  RIGHT_SIDE_ORDER,
  RIGHT_SIDE_TYPES,
} from '../create-envi-modeler-workflow.interface';

/**
 * Compute a simple left-to-right auto-layout for nodes.
 * Comment nodes are placed at y - 90 relative to their sequence position.
 * Right-side nodes (view, outputparameters, datamanager) are stacked vertically
 * one column to the right of all other nodes.
 * Other nodes share the same base y.
 */
export function ComputeLayout(
  nodes: ENVIModelerNode[],
): Map<string, [number, number]> {
  const layout = new Map<string, [number, number]>();
  let col = 0;

  // First pass: place all non-right-side nodes left-to-right
  for (const node of nodes) {
    if (RIGHT_SIDE_TYPES.has(node.type)) {
      continue;
    }
    const x = LAYOUT_BASE_X + col * LAYOUT_STEP_X;

    // init y value
    let y = LAYOUT_BASE_Y;

    // check for special y value cases
    switch (node.type) {
      case 'comment':
        y += LAYOUT_COMMENT_Y_OFFSET;
        break;
      case 'inputparameters':
        y += LAYOUT_RIGHT_STEP_Y;
        break;
    }

    layout.set(node.id, [x, y]);
    if (node.type !== 'comment') {
      col++;
    }
  }

  // Second pass: stack right-side nodes vertically one column to the right,
  // always in the fixed order: view → datamanager → outputparameters
  const rightX = LAYOUT_BASE_X + col * LAYOUT_STEP_X;
  const rightSideNodes = nodes.filter((n) => RIGHT_SIDE_TYPES.has(n.type));
  const sortedRightSide = rightSideNodes
    .slice()
    .sort(
      (a, b) =>
        RIGHT_SIDE_ORDER.indexOf(b.type) - RIGHT_SIDE_ORDER.indexOf(a.type),
    );
  for (let i = 0; i < sortedRightSide.length; i++) {
    layout.set(sortedRightSide[i].id, [
      rightX,
      LAYOUT_BASE_Y + i * LAYOUT_RIGHT_STEP_Y,
    ]);
  }

  return layout;
}
