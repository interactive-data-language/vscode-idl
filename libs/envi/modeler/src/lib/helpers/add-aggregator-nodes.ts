import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

import { BuildConnectionMap } from './build-connection-map';

/**
 * For each task input parameter that receives more than one incoming edge,
 * automatically inserts an aggregator node to collect the values before they
 * are connected to the target parameter.
 *
 * The modified nodes and edges are returned as new arrays; the original
 * arrays are not mutated.
 *
 * Call this after ValidateENVIModelerWorkflow (so type errors are reported first)
 * and before CreateENVIModelerWorkflow.
 */
export function InjectAggregatorNodes(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
): { nodes: ENVIModelerNode[]; edges: ENVIModelerEdge[] } {
  /** Create map for nodes */
  const nodeMap: { [key: string]: ENVIModelerNode } = {};
  for (let i = 0; i < nodes.length; i++) {
    nodeMap[nodes[i].id] = nodes[i];
  }

  /** Build connectivity so that we can verify matching types */
  const connectionMap = BuildConnectionMap(nodes, edges);

  const newNodes: ENVIModelerNode[] = [...nodes];

  /** Edges that will be replaced by aggregator fan-in edges */
  const edgesToRemove = new Set<ENVIModelerEdge>();

  /** New edges created for aggregator wiring */
  const edgesToAdd: ENVIModelerEdge[] = [];

  /** Tracks all node IDs (including newly created ones) to avoid collisions */
  const existingIds = new Set(nodes.map((n) => n.id));

  let aggCounter = 0;
  let needsAggregator = false;

  for (const toNodeId of Object.keys(connectionMap)) {
    // Only task nodes require aggregators on their input parameters
    if (nodeMap[toNodeId]?.type !== 'task') {
      continue;
    }

    for (const toParamName of Object.keys(connectionMap[toNodeId])) {
      // Skip structural (empty-name) connections
      if (toParamName === '') {
        continue;
      }

      const sources = connectionMap[toNodeId][toParamName];

      // Only inject an aggregator when two or more edges feed the same parameter
      if (sources.length <= 1) {
        continue;
      }

      needsAggregator = true;

      // Generate a unique aggregator node ID
      let aggId: string;
      do {
        aggCounter++;
        aggId = `_auto_aggregator_${aggCounter}`;
      } while (existingIds.has(aggId));
      existingIds.add(aggId);

      // Insert the aggregator node immediately before the task node it feeds
      const targetIdx = newNodes.findIndex((n) => n.id === toNodeId);
      if (targetIdx !== -1) {
        newNodes.splice(targetIdx, 0, { id: aggId, type: 'aggregator' });
      } else {
        newNodes.push({ id: aggId, type: 'aggregator' });
      }

      // Fan-in: one edge per source into the aggregator (no named port)
      for (const [fromNodeId, fromParamName] of sources) {
        // Mark the original edge for removal
        const original = edges.find(
          (e) =>
            e.from === fromNodeId &&
            e.to === toNodeId &&
            e.from_parameters.includes(fromParamName),
        );
        if (original !== undefined) {
          edgesToRemove.add(original);
        }

        edgesToAdd.push({
          from: fromNodeId,
          from_parameters: [fromParamName],
          to: aggId,
          to_parameters: [''],
        });
      }

      // Fan-out: single edge from the aggregator to the original target parameter
      edgesToAdd.push({
        from: aggId,
        from_parameters: ['output'],
        to: toNodeId,
        to_parameters: [toParamName],
      });
    }
  }

  // if no aggregators were added, return original
  if (!needsAggregator) {
    return { nodes, edges };
  }

  // otherwise return new model
  return {
    nodes: newNodes,
    edges: [...edges.filter((e) => !edgesToRemove.has(e)), ...edgesToAdd],
  };
}
