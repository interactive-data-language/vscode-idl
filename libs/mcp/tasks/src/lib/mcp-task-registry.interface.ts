import type { LogManager } from '@idl/logger';
import type { AnalyticsRepositoryRegistry } from '@idl/mcp/analytics-repository';
import type {
  IRuleBasedFilters,
  RegistryLocation,
  RegistryLocationKind,
} from '@idl/mcp/shared';
import type {
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import type { z } from 'zod';

/**
 * Options for creating a task registry
 */
export interface IMCPTaskRegistryOptions {
  /** Initial whitelist and blacklist */
  filters?: Partial<IRuleBasedFilters>;
  /** Logger for reporting problems */
  logger: LogManager;
  /** Analytics repositories to pull tasks from */
  repository?: AnalyticsRepositoryRegistry;
  /** Are we operating in strict mode or not? Defaults to true */
  strict?: boolean;
}

/**
 * Internal registry entry that stores all information about a single task
 */
export interface ITaskRegistryEntry {
  /** Description of the task */
  description: string;
  /** Display name of the task */
  displayName: string;
  /** Input parameters for task */
  inputParameters: z.core.JSONSchema.BaseSchema;
  /** Zod schema used to validate input parameters */
  inputSchema: z.ZodType;
  /** Location of the task if we know it */
  location?: RegistryLocation<RegistryLocationKind>;
  /** Output parameters for task */
  outputParameters: z.core.JSONSchema.BaseSchema;
  /** The task structure */
  structure: IGlobalIndexedToken<GlobalStructureToken>;
}

/**
 * Include notes for task
 */
export interface ITaskInformation extends ITaskRegistryEntry {
  notes?: string[];
}
