/**
 * Tracks descriptions of resources
 */
export const RESOURCE_DESCRIPTIONS: { [key: string]: any } = {};

/**
 * tracks content for resources
 */
export const RESOURCE_CONTENT: { [key: string]: any } = {};

/**
 * Registers resources that can be queries and returned to support agentic workflows
 */
export function TrackServerResource(
  name: string,
  description: string,
  content: string
) {
  // save
  RESOURCE_DESCRIPTIONS[name] = description;
  RESOURCE_CONTENT[name] = content;
}
