import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

/**
 * For each task input parameter that receives more than one incoming edge,
 * automatically inserts an aggregator node to collect the values before they
 * are connected to the target parameter.
 *
 * The modified nodes and edges are returned as new arrays; the original
 * arrays are not mutated.
 *
 * Call this after ValidateENVIModelerNodes (so type errors are reported first)
 * and before CreateENVIModelerWorkflow.
 */
export function InjectAggregatorNodes(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
): { nodes: ENVIModelerNode[]; edges: ENVIModelerEdge[] } {
  /** IDs of task nodes — only their input parameters need aggregators */
  const taskNodeIds = new Set(
    nodes.filter((n) => n.type === 'task').map((n) => n.id),
  );

  /**
   * Group edges that target a named input parameter on a task node.
   * Key: `${to}::${to_parameters.join(',')}` — matches the target node and
   * parameter list exactly.
   */
  const edgeGroups = new Map<string, ENVIModelerEdge[]>();

  for (const edge of edges) {
    // Only consider edges targeting task nodes
    if (!taskNodeIds.has(edge.to)) {
      continue;
    }

    // Skip structural connections (empty parameter name)
    if (edge.to_parameters.length === 0 || edge.to_parameters[0] === '') {
      continue;
    }

    const key = `${edge.to}::${edge.to_parameters.join(',')}`;

    if (!edgeGroups.has(key)) {
      edgeGroups.set(key, []);
    }

    /** Group is guaranteed to exist after the set above */
    const group = edgeGroups.get(key) as ENVIModelerEdge[];
    group.push(edge);
  }

  /** Groups that actually need an aggregator (2+ edges to the same parameter) */
  const groupsNeedingAggregator = [...edgeGroups.values()].filter(
    (g) => g.length > 1,
  );

  if (groupsNeedingAggregator.length === 0) {
    return { nodes: [...nodes], edges: [...edges] };
  }

  const newNodes: ENVIModelerNode[] = [...nodes];

  /** Edges that will be replaced by aggregator fan-in edges */
  const edgesToRemove = new Set<ENVIModelerEdge>();

  /** New edges created for aggregator wiring */
  const edgesToAdd: ENVIModelerEdge[] = [];

  /** Tracks all node IDs (including newly created ones) to avoid collisions */
  const existingIds = new Set(nodes.map((n) => n.id));

  let aggCounter = 0;

  for (const group of groupsNeedingAggregator) {
    // Generate a unique aggregator node ID
    let aggId: string;
    do {
      aggCounter++;
      aggId = `_auto_aggregator_${aggCounter}`;
    } while (existingIds.has(aggId));
    existingIds.add(aggId);

    // All edges in the group share the same target node and parameter list
    const { to, to_parameters } = group[0];

    // Insert the aggregator node immediately before the task node it feeds so
    // that the layout and id-map ordering keeps the aggregator upstream
    const targetIdx = newNodes.findIndex((n) => n.id === to);
    if (targetIdx !== -1) {
      newNodes.splice(targetIdx, 0, { id: aggId, type: 'aggregator' });
    } else {
      newNodes.push({ id: aggId, type: 'aggregator' });
    }

    // Redirect each original edge into the aggregator (no named parameter port)
    for (const edge of group) {
      edgesToRemove.add(edge);
      edgesToAdd.push({
        from: edge.from,
        from_parameters: edge.from_parameters,
        to: aggId,
        to_parameters: [''],
      });
    }

    // Single edge from the aggregator output to the original target parameter
    edgesToAdd.push({
      from: aggId,
      from_parameters: ['output'],
      to,
      to_parameters,
    });
  }

  return {
    nodes: newNodes,
    edges: [...edges.filter((e) => !edgesToRemove.has(e)), ...edgesToAdd],
  };
}
