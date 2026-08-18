import {
  IRuleBasedFilters,
  RegistryFileWatcher,
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
  RegistryLocationHelpers,
  RuleBasedFilter,
} from '@idl/mcp/shared';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { basename, join } from 'path';

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
      RegistryLocation_File | RegistryLocation_Memory
    >;
  } = {};

  constructor(localDir: string, filters?: Partial<IRuleBasedFilters>) {
    this.localDir = localDir;

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

    return RegistryLocationHelpers.retrieveContent(this.workflows[lc]);
  }

  /**
   * Returns all workflow names
   */
  getWorkflowNames() {
    return Object.keys(this.workflows).filter((itemName) =>
      this.filters.isAllowedByFilters(itemName),
    );
  }

  /**
   * Checks if we have a workflow registered or nor
   */
  hasWorkflow(workflowName: string) {
    return workflowName.toLowerCase() in this.workflows;
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
}
