import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

import {
  LAYOUT_BASE_X,
  LAYOUT_BASE_Y,
} from './create-envi-modeler-workflow.interface';
import { BuildIdMap } from './helpers/build-id-map';
import { BuildNodeJSON } from './helpers/build-node-json';
import { ComputeLayout } from './helpers/compute-layout';

/**
 * Creates an ENVI Modeler Workflow (JSON) from nodes and edges
 *
 * Assumes that you have run `ValidateENVIModelerNodes` before executing this
 */
export function CreateENVIModelerWorkflow(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
): Record<string, unknown> {
  const layout = ComputeLayout(nodes);
  const idMap = BuildIdMap(nodes);

  // Build nodes array
  const modelNodes = nodes.map((node) => {
    const modelName = idMap.get(node.id) ?? node.id;
    const rawLocation = layout.get(node.id);
    const location: [number, number] = rawLocation ?? [
      LAYOUT_BASE_X,
      LAYOUT_BASE_Y,
    ];
    return BuildNodeJSON(node, modelName, location);
  });

  // Build edges array
  const modelEdges = edges.map((edge) => ({
    from_node: idMap.get(edge.from) ?? edge.from,
    from_parameters: edge.from_parameters.map((param) => param.toLowerCase()),
    to_node: idMap.get(edge.to) ?? edge.to,
    to_parameters: edge.to_parameters.map((param) => param.toLowerCase()),
  }));

  return {
    schema: 'envimodel_1.0',
    nodes: modelNodes,
    edges: modelEdges,
  };
}
