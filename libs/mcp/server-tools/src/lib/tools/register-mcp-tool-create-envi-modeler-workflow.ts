import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ENVIModelerEdge,
  ENVIModelerNode,
  MCP_TOOL_LOOKUP,
} from '@idl/types/mcp';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Zod sub-schemas
// ---------------------------------------------------------------------------

const inputParameterSchema = z.object({
  name: z
    .string()
    .describe(
      'Parameter identifier (uppercase recommended, e.g. INPUT_RASTER)',
    ),
  display_name: z.string().optional().describe('Human-readable display name'),
  description: z
    .string()
    .optional()
    .describe('Description shown to users at runtime'),
  type: z
    .string()
    .describe(
      'ENVI parameter type (e.g. ENVIRASTER, ENVIRASTERARRAY, STRING, DOUBLE, ENVIROIARRAY, ENVIVIRTUALIZABLEURI)',
    ),
});

const nodeSchema = z.object({
  id: z
    .string()
    .describe(
      'Unique identifier for this node used to connect it in edges. Can be any string.',
    ),
  type: z
    .enum([
      'task',
      'inputparameters',
      'outputparameters',
      'iterator',
      'aggregator',
      'arrayvalues',
      'view',
      'datamanager',
      'comment',
      'propertyextractor',
      'arrayextractor',
    ])
    .describe('The kind of Modeler node to create'),
  display_name: z
    .string()
    .optional()
    .describe(
      'Human-readable label on the node canvas. Auto-generated from task_name when omitted for task nodes.',
    ),
  task_name: z
    .string()
    .optional()
    .describe(
      "ENVI Task name for type='task' or type='arrayextractor'. Must come from the 'list-envi-tools' MCP tool.",
    ),
  revision: z
    .string()
    .optional()
    .describe('ENVI Task revision string (e.g. "1.0.0"). Omit to use latest.'),
  static_input: z
    .record(z.unknown())
    .optional()
    .describe(
      "Hardcoded task parameters NOT exposed to the user. Only include values that differ from task defaults – use 'get-envi-tool-parameters' to check defaults.",
    ),
  parameters: z
    .array(inputParameterSchema)
    .optional()
    .describe(
      "For type='inputparameters': parameters the user fills in at runtime.",
    ),
  value: z
    .array(z.unknown())
    .optional()
    .describe("For type='arrayvalues': the literal values in the array."),
  data_type: z
    .string()
    .optional()
    .describe(
      "For type='arrayvalues': data type of the values (e.g. String, Integer, Unsigned Integer, Float, Double).",
    ),
  extract: z
    .number()
    .optional()
    .describe(
      "For type='aggregator': number of items to extract when closing the iterator loop. Default is 1.",
    ),
  indices: z
    .array(z.number())
    .optional()
    .describe(
      "For type='arrayextractor': zero-based indices of elements to extract.",
    ),
});

const edgeSchema = z.object({
  from: z.string().describe('id of the source node'),
  from_parameters: z
    .array(z.string())
    .describe(
      'Output parameter names on the source node. Use [""] for non-parameter connections (e.g. into an iterator or aggregator).',
    ),
  to: z.string().describe('id of the target node'),
  to_parameters: z
    .array(z.string())
    .describe(
      'Input parameter names on the target node. Use [""] for non-parameter connections.',
    ),
});

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

/** Base canvas coordinates used by the official example models */
const LAYOUT_BASE_X = 1200;
const LAYOUT_BASE_Y = 1490;
const LAYOUT_STEP_X = 175;
const LAYOUT_COMMENT_Y_OFFSET = -90;

/**
 * Compute a simple left-to-right auto-layout for nodes.
 * Comment nodes are placed at y - 90 relative to their sequence position.
 * Other nodes share the same base y.
 */
function computeLayout(
  nodes: ENVIModelerNode[],
): Map<string, [number, number]> {
  const layout = new Map<string, [number, number]>();
  let col = 0;

  for (const node of nodes) {
    const x = LAYOUT_BASE_X + col * LAYOUT_STEP_X;
    const y =
      node.type === 'comment'
        ? LAYOUT_BASE_Y + LAYOUT_COMMENT_Y_OFFSET
        : LAYOUT_BASE_Y;
    layout.set(node.id, [x, y]);
    if (node.type !== 'comment') {
      col++;
    }
  }

  return layout;
}

// ---------------------------------------------------------------------------
// Model-JSON builder
// ---------------------------------------------------------------------------

/** Counter map so we can produce task_1, view_2 etc. */
type NameCounters = Record<string, number>;

function nextName(counters: NameCounters, prefix: string): string {
  counters[prefix] = (counters[prefix] ?? 0) + 1;
  return `${prefix}_${counters[prefix]}`;
}

/** Map each user id to the canonical Modeler node name */
function buildIdMap(nodes: ENVIModelerNode[]): Map<string, string> {
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
    map.set(node.id, nextName(counters, prefix));
  }

  return map;
}

/** Convert a single ENVIModelerNode to its JSON representation */
function buildNodeJSON(
  node: ENVIModelerNode,
  modelName: string,
  location: [number, number],
): Record<string, unknown> {
  /** Fixed display names for structural node types */
  const FIXED_DISPLAY_NAMES: Partial<Record<ENVIModelerNode['type'], string>> =
    {
      aggregator: 'Aggregator',
      datamanager: 'Data Manager',
      inputparameters: 'Input Parameters',
      iterator: 'Iterator',
      outputparameters: 'Output Parameters',
      view: 'View',
    };

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

/** Build the full model JSON object */
function buildModelJSON(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
): Record<string, unknown> {
  const layout = computeLayout(nodes);
  const idMap = buildIdMap(nodes);

  // Build nodes array
  const modelNodes = nodes.map((node) => {
    const modelName = idMap.get(node.id) ?? node.id;
    const rawLocation = layout.get(node.id);
    const location: [number, number] = rawLocation ?? [
      LAYOUT_BASE_X,
      LAYOUT_BASE_Y,
    ];
    return buildNodeJSON(node, modelName, location);
  });

  // Build edges array
  const modelEdges = edges.map((edge) => ({
    from_node: idMap.get(edge.from) ?? edge.from,
    from_parameters: edge.from_parameters,
    to_node: idMap.get(edge.to) ?? edge.to,
    to_parameters: edge.to_parameters,
  }));

  return {
    schema: 'envimodel_1.0',
    nodes: modelNodes,
    edges: modelEdges,
  };
}

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

/**
 * Registers the Create ENVI Modeler Workflow MCP tool.
 *
 * This tool does not require IDL or ENVI — it is a pure file-creation tool
 * that generates a `.model` file from a simple node/edge description.
 */
export function RegisterMCPTool_CreateENVIModelerWorkflow(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW
        ],
      description: [
        'Creates an ENVI Modeler workflow file (.model) from a simplified node and edge description.',
        '',
        '## Critical usage rules',
        `- Task names MUST come from the '${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}' MCP tool.`,
        `- Task parameter names and defaults MUST be verified via '${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS}'.`,
        '- Only include parameters in static_input that DIFFER from their defaults.',
        '  Default parameters do NOT need to be specified.',
        '- Every edge from/to value must match an id in the nodes array.',
        '',
        '## Node types',
        '- task: An ENVI Task. Requires task_name. Optional: revision, static_input.',
        '- inputparameters: User-exposed inputs. Requires parameters[].',
        '- outputparameters: Exposes final outputs from the workflow.',
        '- iterator: Loops over an array of values or rasters for batch processing.',
        '- aggregator: Closes an iterator loop, collecting results into an array. Optional: extract (default 1). When used as edge source, from_parameters is always ["output"].',
        '- arrayvalues: A static array of literal values. Requires value[]. Optional: data_type.',
        '- view: SINK node. Displays a raster or value in ENVI. Only appears as edge target, never source. Accepts input_raster or input_string in to_parameters.',
        '- datamanager: SINK node. Adds a raster to the ENVI Data Manager. Only appears as edge target, never source. Accepts input_raster in to_parameters.',
        '- comment: A text annotation on the canvas. Requires display_name. Not connected by edges.',
        '- propertyextractor: Extracts named properties from an ENVI object.',
        '- arrayextractor: Extracts elements from an array by index. Requires indices[].',
        '',
        '## Edge source/sink rules',
        '- inputparameters: SOURCE only — always from_node, never to_node.',
        '- outputparameters: SINK only — always to_node, never from_node. Use [""] for to_parameters.',
        '- view: SINK only — always to_node, never from_node.',
        '- datamanager: SINK only — always to_node, never from_node.',
        '',
        '## Other edge connection rules',
        'Use from_parameters/to_parameters of [""] for connections that carry no named parameter',
        '(e.g. arrayvalues→iterator, iterator→task port, task→aggregator).',
      ].join('\n'),
      inputSchema: {
        output_path: z
          .string()
          .describe(
            'Fully-qualified output file path ending in ".model". Example: "C:/Users/me/Documents/MyWorkflow.model"',
          ),
        nodes: z
          .array(nodeSchema)
          .describe(
            'Ordered list of workflow nodes. Nodes are laid out left-to-right in the order they appear. Put inputparameters first, then processing tasks, then view/datamanager last.',
          ),
        edges: z
          .array(edgeSchema)
          .describe('Directed connections between node outputs and inputs.'),
      },
    },
    async (id, { output_path, nodes, edges }) => {
      // ---- validate edges reference valid node ids and obey source/sink rules
      const nodeIds = new Set(nodes.map((n) => n.id));
      const nodeTypeById = new Map(nodes.map((n) => [n.id, n.type]));

      /** Node types that are sinks — may only appear as edge targets */
      const SINK_TYPES = new Set(['outputparameters', 'view', 'datamanager']);

      /** Node types that are sources — may only appear as edge origins */
      const SOURCE_TYPES = new Set(['inputparameters']);

      const badEdges: string[] = [];
      for (const edge of edges) {
        if (!nodeIds.has(edge.from)) {
          badEdges.push(
            `Edge references unknown source node id "${edge.from}"`,
          );
        }
        if (!nodeIds.has(edge.to)) {
          badEdges.push(`Edge references unknown target node id "${edge.to}"`);
        }

        const fromType = nodeTypeById.get(edge.from);
        if (fromType && SINK_TYPES.has(fromType)) {
          badEdges.push(
            `Node "${edge.from}" (type "${fromType}") is a sink-only node and cannot be an edge source`,
          );
        }
        if (fromType === 'aggregator') {
          edge.from_parameters = ['output'];
        }

        const toType = nodeTypeById.get(edge.to);
        if (toType && SOURCE_TYPES.has(toType)) {
          badEdges.push(
            `Node "${edge.to}" (type "${toType}") is a source-only node and cannot be an edge target`,
          );
        }
      }
      if (badEdges.length > 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Invalid workflow: ${badEdges.join('; ')}`,
            },
          ],
        };
      }

      // ---- build the model JSON
      const modelJSON = buildModelJSON(
        nodes as ENVIModelerNode[],
        edges as ENVIModelerEdge[],
      );
      const modelContent = JSON.stringify(modelJSON, null, 4);

      // ---- write to disk
      try {
        mkdirSync(dirname(output_path), { recursive: true });
        writeFileSync(output_path, modelContent, 'utf-8');
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Failed to write model file: ${String(err)}`,
            },
          ],
        };
      }

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: `ENVI Modeler workflow written to: ${output_path}\n\n${modelContent}`,
          },
        ],
      };
    },
  );
}
