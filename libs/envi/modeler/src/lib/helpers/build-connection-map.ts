import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/mcp';

/**
 * Creates a map of all connections between nodes
 *
 * Useful for validation that parameters can be connected to
 * one another and for checking if aggregators need to
 * be used
 */
export function BuildConnectionMap(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
) {
  /** Create map for nodes */
  const nodeMap: { [key: string]: ENVIModelerNode } = {};
  for (let i = 0; i < nodes.length; i++) {
    nodeMap[nodes[i].id] = nodes[i];
  }

  /** Build connectivity so that we can verify matching types */
  const connectionMap: {
    // node we connect to
    [nodeId: string]: {
      // parameter we connect to and [nodeid, parameterName]
      [inParamName: string]: [[string, string]];
    };
  } = {};

  /**
   * Validate all of our edges
   */
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    // extract nodes
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];

    // save to connections
    if (!(edge.to in connectionMap)) {
      connectionMap[edge.to] = {};
    }

    // save connection map
    const toConnect = connectionMap[edge.to];

    // validate from parameters
    for (let j = 0; j < edge.from_parameters.length; j++) {
      const fromParam = edge.from_parameters[j];

      /**
       * Get the index to update
       *
       * If 1:1 for parameters, then they connect to each other
       *
       * If we have 2 from one node and one on the second, they all go
       * to the first
       */
      const idxUpdate =
        edge.to_parameters.length === edge.from_parameters.length ? j : 0;

      const toParam = edge.to_parameters[idxUpdate];
      if (!(toParam in toConnect)) {
        toConnect[toParam] = [[from.id, fromParam]];
      } else {
        toConnect[toParam].push([from.id, fromParam]);
      }
    }
  }

  return connectionMap;
}
