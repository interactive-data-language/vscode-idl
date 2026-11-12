import { IDL_MCP_LOG, type LogManager } from '@idl/logger';
import {
  type AnalyticsRepositoryRegistry,
  LatestPackages,
  PackageSource,
} from '@idl/mcp/analytics-repository';
import {
  RegistryFileWatcher,
  type IRegistryListOptions,
  type RegistryLocation,
  type RegistryLocation_File,
  type RegistryLocation_Memory,
  type RegistryLocation_Repository,
  RegistryLocationHelpers,
  RuleBasedFilter,
} from '@idl/mcp/shared';
import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { basename, join } from 'path';

import type { IMCPToolWorkflowRegistryOptions } from './mcp-tool-workflow-registry.interface';

/**
 * Helper class that tracks and manages access to tool workflows
 */
export class MCPToolWorkflowRegistry {
  /** Object class that handles filtering items from the task registry */
  filters = new RuleBasedFilter();

  /**
   * Local workflow folder
   */
  private localDir: string;

  /**
   * Logger, used to report problems reaching analytics repositories
   */
  private logger?: LogManager;

  /**
   * Optional analytics repositories that we pull workflows from
   */
  private repository?: AnalyticsRepositoryRegistry;

  /**
   * Watches the local workflow folder so new/removed files stay in sync
   */
  private watcher: RegistryFileWatcher;

  /**
   * Lookup of tool workflows by name and value
   *
   * No description, the names should be short, concise, and descriptive
   * like a title to a web page
   */
  private workflows: {
    [key: string]: RegistryLocation<
      | RegistryLocation_File
      | RegistryLocation_Memory
      | RegistryLocation_Repository
    >;
  } = {};

  constructor(options: IMCPToolWorkflowRegistryOptions) {
    const { repository, filters, localDir, logger } = options;
    this.localDir = localDir;
    this.repository = repository;
    this.logger = logger;

    // make the local folder if it doesn't exist
    if (!existsSync(this.localDir)) {
      mkdirSync(this.localDir, { recursive: true });
    }

    // load workflows
    this.loadWorkflowsFromFolder(this.localDir);

    // keep the registry in sync as workflow files are added/removed on disk
    this.watcher = new RegistryFileWatcher({
      folder: this.localDir,
      filter: /\.md$/i,
      onCreate: (location) =>
        this.addToolWorkflowFromFile(location.meta.path, true),
      onDelete: (location) =>
        this.removeToolWorkflowFromFile(location.meta.path),
    });

    // save filters
    if (filters !== undefined) {
      this.filters.updateFilters(filters);
    }
  }

  /**
   * Add many tool workflows
   */
  addManyToolWorkflows(workflows: { [key: string]: string }) {
    const names = Object.keys(workflows);
    for (let i = 0; i < names.length; i++) {
      this.addToolWorkflow(names[i], workflows[names[i]]);
    }
  }

  /**
   * Adds notes to our task registry that are provided when
   * returning detail about a task
   */
  addToolWorkflow(workflowName: string, workflowText: string, replace = false) {
    // get lower case
    const lc = workflowName.toLowerCase();

    // skip if already exists
    if (!replace && lc in this.workflows) {
      return;
    }

    // make sure we have an array of notes
    this.workflows[lc] = {
      type: 'memory',
      meta: {
        content: workflowText,
      },
    };
  }

  /**
   * Adds a tool workflow from a file
   */
  addToolWorkflowFromFile(filePath: string, replace = false) {
    // get lower case
    const lc = basename(filePath, '.md').toLowerCase();

    // skip if already exists
    if (!replace && lc in this.workflows) {
      return;
    }

    // make sure we have an array of notes
    this.workflows[lc] = {
      type: 'file',
      meta: {
        path: filePath,
      },
    };
  }

  /**
   * Stops watching the local workflow folder for changes
   */
  dispose() {
    this.watcher.stop();
  }

  /**
   * Gets a tool workflow by name
   *
   * Returns an empty string if no matching workflow (use hasWorkflow() to check first)
   */
  getWorkflow(workflowName: string): string {
    /** Get lower case name */
    const lc = workflowName.toLowerCase();

    // return if no match
    if (!(lc in this.workflows)) {
      return '';
    }

    const location = this.workflows[lc];

    // names are tracked in lower case, so find the original key in the package
    const key =
      location.type === 'repository'
        ? Object.keys(
            location.meta.package.metadata.envi_tool_workflows ?? {},
          ).find((name) => name.toLowerCase() === lc)
        : undefined;

    return RegistryLocationHelpers.retrieveContent(
      location,
      'envi_tool_workflows',
      key,
    );
  }

  /**
   * Returns all workflow names
   */
  getWorkflowNames(ignoreFilters = false) {
    return Object.keys(this.workflows).filter(
      (itemName) => ignoreFilters || this.filters.isAllowedByFilters(itemName),
    );
  }

  /**
   * Checks if we have a workflow registered or nor
   */
  hasWorkflow(workflowName: string) {
    return workflowName.toLowerCase() in this.workflows;
  }

  /**
   * Refreshes workflows from analytics repositories (if configured) and returns
   * the names of all registered workflows.
   *
   * If we can't reach the repositories, we log and keep the current workflows.
   */
  async list(options?: IRegistryListOptions): Promise<string[]> {
    if (this.repository) {
      try {
        this.replaceRepositoryWorkflows(
          await this.repository.getENVIToolWorkflowPackages(),
        );
      } catch (err) {
        this.logger?.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: [
            'Unable to refresh ENVI Tool workflows from analytics repositories',
            err,
          ],
        });
      }
    }

    return this.getWorkflowNames(options?.ignoreFilters);
  }

  /**
   * Loads files from a folder, not-recursive
   */
  loadWorkflowsFromFolder(folder: string, replace = false) {
    // load any markdown files from the local directory as workflows
    const files = readdirSync(folder)
      .filter((f) => f.toLowerCase().endsWith('.md'))
      .map((file) => {
        return join(folder, file);
      });

    // add all
    for (let i = 0; i < files.length; i++) {
      this.addToolWorkflowFromFile(files[i], replace);
    }
  }

  /**
   * Refresh the local workflow list
   */
  refreshLocalWorkflowList() {
    this.loadWorkflowsFromFolder(this.localDir, true);
  }

  /**
   * Removes a tool workflow that was tracked from a file on disk
   */
  removeToolWorkflowFromFile(filePath: string) {
    delete this.workflows[basename(filePath, '.md').toLowerCase()];
  }

  /**
   * Sets the logger used to report problems, like reaching analytics repositories
   */
  setLogger(logger?: LogManager) {
    this.logger = logger;
  }

  /**
   * Removes all workflows that came from a repository and replaces them with
   * the latest version of each package.
   *
   * Workflows that come from local files or memory always win name conflicts
   */
  private replaceRepositoryWorkflows(
    packages: IAnalyticRepository_ServerPackage[],
  ) {
    // remove everything we got from a repository
    for (const key of Object.keys(this.workflows)) {
      if (this.workflows[key].type === 'repository') {
        delete this.workflows[key];
      }
    }

    for (const item of LatestPackages(packages)) {
      const names = Object.keys(
        item.package.metadata.envi_tool_workflows ?? {},
      );

      for (const name of names) {
        const lc = name.toLowerCase();

        // local workflows win
        if (lc in this.workflows) {
          continue;
        }

        this.workflows[lc] = {
          type: 'repository',
          meta: {
            package: item.package,
            url: PackageSource(item),
            version: item.package.version,
          },
        };
      }
    }
  }
}
