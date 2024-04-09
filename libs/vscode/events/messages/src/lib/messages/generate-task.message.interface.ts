/**
 * Message for generating tasks
 */
export type GenerateTaskMessage = 'generate/task';

/**
 * Payload when we rename files
 */
export interface IGenerateTaskPayload {
  /**
   * PRO file we generate a task for
   */
  uri: string;
  /**
   * Type of task that we generate
   */
  type: 'envi' | 'idl';
}
