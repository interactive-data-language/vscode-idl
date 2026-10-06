import {
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
} from '@idl/mcp/shared';

/**
 * Registered skill entry in the skill registry
 */
export interface ISkill {
  /** Description for when the skill should be used */
  description: string;
  /** Location of the skill content */
  location: RegistryLocation<RegistryLocation_File | RegistryLocation_Memory>;
  /** Lower-case name / ID of the skill */
  name: string;
}
