import type { LogManager } from '@idl/logger';
import type { AnalyticsRepositoryRegistry } from '@idl/mcp/analytics-repository';
import type {
  IRuleBasedFilters,
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
  RegistryLocation_Repository,
} from '@idl/mcp/shared';

/**
 * Options for creating a skill registry
 */
export interface IMCPSkillRegistryOptions {
  /** Initial whitelist and blacklist */
  filters?: Partial<IRuleBasedFilters>;
  /** Logger for reporting problems */
  logger?: LogManager;
  /** Analytics repositories to pull skills from */
  repository?: AnalyticsRepositoryRegistry;
}

/**
 * Registered skill entry in the skill registry
 */
export interface ISkill {
  /** Description for when the skill should be used */
  description: string;
  /** Location of the skill content */
  location: RegistryLocation<
    | RegistryLocation_File
    | RegistryLocation_Memory
    | RegistryLocation_Repository
  >;
  /** Lower-case name / ID of the skill */
  name: string;
}
