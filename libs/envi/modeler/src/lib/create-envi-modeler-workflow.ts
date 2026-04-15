import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

import {
  LAYOUT_BASE_X,
  LAYOUT_BASE_Y,
} from './create-envi-modeler-workflow.interface';
import { InjectAggregatorNodes } from './helpers/add-aggregator-nodes';
import { AddCommentNodes } from './helpers/add-comment-nodes';
import { BuildIdMap } from './helpers/build-id-map';
import { BuildNodeJSON } from './helpers/build-node-json';
import { ComputeLayout } from './helpers/compute-layout';
import { RemoveSingletonNodes } from './helpers/remove-singleton-nodes';

/**
 * Creates an ENVI Modeler Workflow (JSON) from nodes and edges
 *
 * Assumes that you have run `ValidateENVIModelerNodes` before executing this
 */
export function CreateENVIModelerWorkflow(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
  registry: MCPTaskRegistry,
): Record<string, unknown> {
  /**
   * Preprocess nodes to simplify and automatically resolve errors
   */
  const deduped = RemoveSingletonNodes(nodes, edges);
  const injected = InjectAggregatorNodes(deduped.nodes, deduped.edges);

  // generate layoutWE
  const layout = ComputeLayout(injected.nodes);

  // create ID map
  const idMap = BuildIdMap(injected.nodes);

  // Build nodes array
  const modelNodes = injected.nodes.map((node) => {
    const modelName = idMap.get(node.id) ?? node.id;
    const rawLocation = layout.get(node.id);
    const location: [number, number] = rawLocation ?? [
      LAYOUT_BASE_X,
      LAYOUT_BASE_Y,
    ];
    return BuildNodeJSON(node, modelName, location, registry);
  });

  // automatically add in comment nodes
  AddCommentNodes(injected.nodes, modelNodes, layout);

  // Build edges array
  const modelEdges = injected.edges.map((edge) => ({
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
