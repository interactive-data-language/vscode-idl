export type MCPPromptType = 'envi' | 'idl';

export interface MCPPromptLookup {
  /** Description for when the prompt should be used */
  description: string;
  /** Lower-case name of the prompts */
  name: string;
  /** Content of the prompt file */
  prompt: string;
  /** Type of prompt */
  type: MCPPromptType;
}
