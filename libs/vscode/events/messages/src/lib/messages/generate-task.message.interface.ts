/**
 * Message for generating tasks
 */
export type GenerateTaskMessage = 'generate/task';

/**
 * Payload when we rename files
 */
export interface IGenerateTaskPayload {
  /**
   * Type of task that we generate
   */
  type: 'envi' | 'idl';
  /**
   * PRO file we generate a task for
   */
  uri: string;
}
