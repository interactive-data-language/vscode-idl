import {
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
} from '@idl/mcp/shared';

export type MCPPromptType = 'envi' | 'idl';

export interface MCPPromptLookup {
  /** Description for when the prompt should be used */
  description: string;
  /** Location of the prompt content */
  location: RegistryLocation<RegistryLocation_File | RegistryLocation_Memory>;
  /** Lower-case name of the prompt */
  name: string;
  /** Type of prompt */
  type: MCPPromptType;
}
