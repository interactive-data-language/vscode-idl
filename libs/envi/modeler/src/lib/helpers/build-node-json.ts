import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { ENVIModelerNode } from '@idl/types/mcp';

import { FIXED_DISPLAY_NAMES } from '../create-envi-modeler-workflow.interface';

/** Convert a single ENVIModelerNode to its JSON representation */
export function BuildNodeJSON(
  node: ENVIModelerNode,
  modelName: string,
  location: [number, number],
  registry: MCPTaskRegistry,
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

      // check if we have a display name
      if (registry.hasTask(node.task_name as string)) {
        // get display name
        const info = registry.getTaskDetail(node.task_name as string);

        // set display name of task
        if (info.structure.meta.readableName) {
          base['display_name'] = info.structure.meta.readableName;
        }
      }

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
