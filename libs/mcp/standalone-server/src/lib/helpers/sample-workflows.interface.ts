import type { AgentWorkflowTemplate } from '@idl/types/workflow-templates';

/**
 * Hardcoded Agent Workflow Templates shown in the "New Workflow" stepper.
 *
 * TODO: move to a real data store once templates need to be user-editable.
 */
export const SAMPLE_WORKFLOWS: AgentWorkflowTemplate[] = [
  {
    id: 'change-detection-eo',
    name: 'Change Detection',
    description:
      'Detect and quantify change between two optical images captured at different times over the same area.',
    promptPlaceholder:
      'Detect change between the two images I provide for my area of interest and summarize what changed.',
    tags: ['EO'],
  },
  {
    id: 'sar-flood-mapping',
    name: 'SAR Flood Mapping',
    description:
      'Use SAR imagery to map surface water extent and identify flooded areas within an area of interest.',
    promptPlaceholder:
      'Use SAR imagery to map flooded areas within my area of interest.',
    tags: ['SAR'],
    toolWorkflowName: 'sar-flood-mapping',
  },
  {
    id: 'dsm-terrain-analysis',
    name: 'Terrain Analysis',
    description:
      'Derive slope, aspect, and hillshade products from a digital surface model for an area of interest.',
    promptPlaceholder:
      'Generate slope, aspect, and hillshade products from a DSM for my area of interest.',
    tags: ['DSM'],
  },
  {
    id: 'lidar-vegetation-structure',
    name: 'LiDAR Vegetation Structure',
    description:
      'Analyze LiDAR point cloud returns to estimate vegetation height and canopy structure.',
    promptPlaceholder:
      'Analyze the LiDAR data for my area of interest and estimate vegetation height and canopy structure.',
    tags: ['LiDAR'],
  },
];
