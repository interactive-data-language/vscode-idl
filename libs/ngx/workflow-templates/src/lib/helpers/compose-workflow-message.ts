import type { AgentWorkflowTemplate } from '@idl/types/workflow-templates';
import type { Feature, Polygon } from 'geojson';

/**
 * Composes the chat message sent to the LLM from a selected workflow
 * template, an optional AOI, and optional notes.
 */
export function ComposeWorkflowMessage(
  template: AgentWorkflowTemplate,
  aoi: Feature<Polygon> | undefined,
  notes: string,
): string {
  // init strings for request to the LLM
  const lines: string[] = [
    `Workflow template: ${template.name}`,
    `Description: ${template.description}`,
    '',
  ];

  // add data tags
  if (template.tags.length > 0) {
    lines.push('', `Related data types: ${template.tags.join(', ')}`);
  }

  // attach the AOI
  if (aoi) {
    lines.push('', 'Area of interest (GeoJSON):', JSON.stringify(aoi));
  }

  // insert the tool workflow
  if (template.toolWorkflowName) {
    lines.push(
      '',
      `Once you have data, use the ENVI Tool Workflow "${template.toolWorkflowName}" to process the data.`,
    );
  } else {
    lines.push('', `${template.promptPlaceholder}`);
  }

  // include notes
  const trimmedNotes = notes.trim();
  if (trimmedNotes) {
    lines.push('', `Additional notes: ${trimmedNotes}`);
  }

  return lines.join('\n');
}
