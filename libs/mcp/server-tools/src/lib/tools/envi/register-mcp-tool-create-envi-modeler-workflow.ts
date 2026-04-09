import {
  CreateENVIModelerWorkflow,
  ValidateENVIModelerNodes,
} from '@idl/envi/modeler';
import { MCPServer } from '@idl/mcp/server';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { z } from 'zod';

const inputParameterSchema = z.object({
  name: z
    .string()
    .describe(
      'Parameter identifier (lowercase recommended, e.g. input_raster)',
    ),
  display_name: z.string().optional().describe('Human-readable display name'),
  description: z
    .string()
    .optional()
    .describe('Description shown to users at runtime'),
  type: z
    .string()
    .describe(
      'ENVI parameter type (e.g. ENVIRaster, ENVIRasterArray, String, Double, ENVIROIArray, ENVIVIRTUALIZABLEURI)',
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
      `ENVI Task name for type='task' or type='arrayextractor'. Must come from the '${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}' MCP tool.`,
    ),
  revision: z
    .string()
    .optional()
    .describe('ENVI Task revision string (e.g. "1.0.0"). Omit to use latest.'),
  static_input: z
    .record(z.unknown())
    .optional()
    .describe(
      `Hardcoded task parameters NOT exposed to the user. Only include values that differ from task defaults, use '${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS}' to check defaults.`,
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
// Tool registration
// ---------------------------------------------------------------------------

/**
 * Registers the Create ENVI Modeler Workflow MCP tool.
 *
 * This tool does not require IDL or ENVI — it is a pure file-creation tool
 * that generates a `.model` file from a simple node/edge description.
 */
export function RegisterMCPTool_CreateENVIModelerWorkflow(
  server: MCPServer,
  registry: MCPTaskRegistry,
) {
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
      /** Validate the nodes and check for errors */
      const errors = ValidateENVIModelerNodes(nodes, edges, registry);

      // report MCP tool failure if bad node
      if (errors.length > 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Invalid workflow: ${errors.join('; ')}`,
            },
          ],
        };
      }

      /** Make JSON content */
      const modelJSON = CreateENVIModelerWorkflow(
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
