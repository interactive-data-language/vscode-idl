import { ENVIModelerNode } from '@idl/types/mcp';

/** Counter map so we can produce task_1, view_2 etc. */
type NameCounters = Record<string, number>;

/** Get's next name for a node */
function NextName(counters: NameCounters, prefix: string): string {
  counters[prefix] = (counters[prefix] ?? 0) + 1;
  return `${prefix}_${counters[prefix]}`;
}

/** Map each node id to the canonical Modeler node name */
export function BuildIdMap(nodes: ENVIModelerNode[]): Map<string, string> {
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
