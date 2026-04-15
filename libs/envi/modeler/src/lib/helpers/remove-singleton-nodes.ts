import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

/**
 * Node types of which only one instance is meaningful in a workflow.
 * When multiple are present, all but the first are removed and every edge
 * that referenced a removed node is re-pointed to the surviving node.
 */
const SINGLETON_TYPES = new Set<ENVIModelerNode['type']>([
  'datamanager',
  'outputparameters',
  'view',
]);

/**
 * Reduces duplicate singleton nodes (view, datamanager, outputparameters) to a
 * single instance each.
 *
 * For each singleton type that appears more than once:
 * - The first occurrence in the array is kept (the survivor).
 * - All subsequent occurrences are dropped.
 * - Any edge whose `from` or `to` points at a dropped node is re-wired to the
 *   survivor.
 *
 * Returns new arrays; the originals are not mutated.
 */
export function RemoveSingletonNodes(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
): { nodes: ENVIModelerNode[]; edges: ENVIModelerEdge[] } {
  /** Maps removed node id → surviving node id for the same type */
  const remapIds = new Map<string, string>();

  /** First-seen id per singleton type */
  const survivorByType = new Map<ENVIModelerNode['type'], string>();

  /** Nodes that we keep */
  const keptNodes: ENVIModelerNode[] = [];

  // filter out duplicate nodes
  for (const node of nodes) {
    if (!SINGLETON_TYPES.has(node.type)) {
      keptNodes.push(node);
      continue;
    }

    // save first encounter
    if (!survivorByType.has(node.type)) {
      survivorByType.set(node.type, node.id);
      keptNodes.push(node);
    } else {
      // update
      remapIds.set(node.id, survivorByType.get(node.type) as string);
    }
  }

  // return if nothing to change
  if (remapIds.size === 0) {
    return { nodes, edges };
  }

  // correct edges
  const remappedEdges = edges.map((edge) => {
    const newFrom = remapIds.get(edge.from);
    const newTo = remapIds.get(edge.to);

    // return existing if no changes
    if (!newFrom && !newTo) {
      return edge;
    }

    // return with updates
    return {
      ...edge,
      ...(newFrom ? { from: newFrom } : {}),
      ...(newTo ? { to: newTo } : {}),
    };
  });

  return { nodes: keptNodes, edges: remappedEdges };
}
