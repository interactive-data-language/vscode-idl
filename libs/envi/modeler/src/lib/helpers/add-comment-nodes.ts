import { ENVIModelerNode } from '@idl/types/mcp';

import {
  LAYOUT_BASE_X,
  LAYOUT_BASE_Y,
  LAYOUT_COMMENT_Y_OFFSET,
} from '../create-envi-modeler-workflow.interface';

/**
 * Add comment nodes into the ENVI Modeler Nodes
 */
export function AddCommentNodes(
  inputNodes: ENVIModelerNode[],
  modelNodes: { [key: string]: any }[],
  layout: Map<string, [number, number]>,
) {
  // Synthesize comment nodes from node.comment properties
  let commentCounter = 0;
  for (const node of inputNodes) {
    if (node.comment) {
      const rawLocation = layout.get(node.id);
      const parentX = rawLocation ? rawLocation[0] : LAYOUT_BASE_X;
      const parentY = rawLocation ? rawLocation[1] : LAYOUT_BASE_Y;
      commentCounter++;
      modelNodes.push({
        display_name: node.comment,
        location: [parentX, parentY + LAYOUT_COMMENT_Y_OFFSET],
        name: `comment_${commentCounter}`,
        type: 'comment',
      });
    }
  }
}
