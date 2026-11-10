import type { LogManager } from '@idl/logger';
import type { AnalyticsRepositoryRegistry } from '@idl/mcp/analytics-repository';
import type { IRuleBasedFilters } from '@idl/mcp/shared';

/**
 * Options for creating a tool workflow registry
 */
export interface IMCPToolWorkflowRegistryOptions {
  /** Initial whitelist and blacklist */
  filters?: Partial<IRuleBasedFilters>;
  /** Local folder to load (and watch) workflows from */
  localDir: string;
  /** Logger for reporting problems */
  logger?: LogManager;
  /** Analytics repositories to pull workflows from */
  repository?: AnalyticsRepositoryRegistry;
}
