import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

import {
  FIXED_DISPLAY_NAMES,
  LAYOUT_BASE_X,
  LAYOUT_BASE_Y,
  LAYOUT_COMMENT_Y_OFFSET,
  LAYOUT_RIGHT_STEP_Y,
  LAYOUT_STEP_X,
  RIGHT_SIDE_TYPES,
} from './build-envi-modeler-workflow.interface';

/** Counter map so we can produce task_1, view_2 etc. */
type NameCounters = Record<string, number>;

/** Get's next name for a node */
function NextName(counters: NameCounters, prefix: string): string {
  counters[prefix] = (counters[prefix] ?? 0) + 1;
  return `${prefix}_${counters[prefix]}`;
}

/**
 * Compute a simple left-to-right auto-layout for nodes.
 * Comment nodes are placed at y - 90 relative to their sequence position.
 * Right-side nodes (view, outputparameters, datamanager) are stacked vertically
 * one column to the right of all other nodes.
 * Other nodes share the same base y.
 */
function ComputeLayout(
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

  // Second pass: stack right-side nodes vertically one column to the right
  const rightX = LAYOUT_BASE_X + col * LAYOUT_STEP_X;
  let rightRow = 0;
  for (const node of nodes) {
    if (!RIGHT_SIDE_TYPES.has(node.type)) {
      continue;
    }
    layout.set(node.id, [
      rightX,
      LAYOUT_BASE_Y + rightRow * LAYOUT_RIGHT_STEP_Y,
    ]);
    rightRow++;
  }

  return layout;
}

/** Map each user id to the canonical Modeler node name */
function BuildIdMap(nodes: ENVIModelerNode[]): Map<string, string> {
  const map = new Map<string, string>();
  const counters: NameCounters = {};

  for (const node of nodes) {
    let prefix: string;
    switch (node.type) {
      case 'aggregator':
        prefix = 'aggregator';
        break;
      case 'arrayextractor':
        prefix = 'elementExtractor';
        break;
      case 'arrayvalues':
        prefix = 'values';
        break;
      case 'comment':
        prefix = 'comment';
        break;
      case 'datamanager':
        prefix = 'dataManager';
        break;
      case 'inputparameters':
        prefix = 'parameters';
        break;
      case 'iterator':
        prefix = 'iterator';
        break;
      case 'outputparameters':
        prefix = 'parameters';
        break;
      case 'propertyextractor':
        prefix = 'propertyExtractor';
        break;
      case 'task':
        prefix = 'task';
        break;
      case 'view':
        prefix = 'view';
        break;
      default:
        prefix = 'node';
    }
    map.set(node.id, NextName(counters, prefix));
  }

  return map;
}

/** Convert a single ENVIModelerNode to its JSON representation */
function BuildNodeJSON(
  node: ENVIModelerNode,
  modelName: string,
  location: [number, number],
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    display_name:
      FIXED_DISPLAY_NAMES[node.type] ??
      node.display_name ??
      node.task_name ??
      node.type,
    location,
    name: modelName,
    type: node.type,
  };

  switch (node.type) {
    case 'aggregator':
      base['revision'] = node.revision ?? '1.0.0';
      base['extract'] = node.extract ?? 1;
      break;

    case 'arrayextractor': {
      const extTask: Record<string, unknown> = {
        name: node.task_name ?? 'ExtractElementFromArray',
      };
      if (node.static_input && Object.keys(node.static_input).length > 0) {
        extTask['static_input'] = node.static_input;
      } else if (node.indices) {
        extTask['static_input'] = { indices: node.indices };
      }
      if (node.revision) {
        extTask['revision'] = node.revision;
      }
      base['envitask'] = extTask;
      if (node.indices) {
        base['indices'] = node.indices;
      }
      break;
    }

    case 'arrayvalues':
      base['value'] = node.value ?? [];
      base['data_type'] = node.data_type ?? 'String';
      break;

    case 'comment':
      // comment nodes carry only display_name, location, name, type — already set
      break;

    case 'datamanager':
      base['revision'] = node.revision ?? '1.0.0';
      break;

    case 'inputparameters': {
      const params = (node.parameters ?? []).map((p) => {
        const entry: Record<string, string> = { name: p.name };
        if (p.display_name) entry['display_name'] = p.display_name;
        if (p.description) entry['description'] = p.description;
        entry['name'] = p.name.toLowerCase();
        entry['type'] = p.type;
        return entry;
      });
      base['parameters'] = params;
      break;
    }

    case 'iterator':
      base['revision'] = node.revision ?? '1.0.0';
      break;

    case 'outputparameters':
      // no extra fields needed
      break;

    case 'propertyextractor':
      base['revision'] = node.revision ?? '1.0.0';
      break;

    case 'task': {
      const envitask: Record<string, unknown> = {
        name: node.task_name,
      };
      if (node.static_input && Object.keys(node.static_input).length > 0) {
        envitask['static_input'] = node.static_input;
      }
      if (node.revision) {
        envitask['revision'] = node.revision;
      }
      base['envitask'] = envitask;
      break;
    }

    case 'view':
      base['revision'] = node.revision ?? '1.0.0';
      break;

    default:
      break;
  }

  return base;
}

/** Creates an ENVI Modeler Workflow (JSON) from nodes and edges */
export function BuildENVIModelerWorkflow(
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
