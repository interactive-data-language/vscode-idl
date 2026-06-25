import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { basename, join } from 'path';

/**
 * Helper class that tracks and manages access to tool workflows
 */
export class MCPToolWorkflowRegistry {
  /**
   * Local workflow folder
   */
  private localDir: string;

  /**
   * Lookup of tool workflows by name and value
   *
   * No description, the names should be short, concise, and descriptive
   * like a title to a web page
   */
  private workflows: { [key: string]: string } = {};

  constructor(localDir: string) {
    this.localDir = localDir;

    // make the local folder if it doesn't exist
    if (!existsSync(this.localDir)) {
      mkdirSync(this.localDir, { recursive: true });
    }

    // load any markdown files from the local directory as workflows
    const files = readdirSync(this.localDir).filter((f) =>
      f.toLowerCase().endsWith('.md'),
    );
    for (let i = 0; i < files.length; i++) {
      const workflowName = basename(files[i], '.md');
      const workflowText = readFileSync(join(this.localDir, files[i]), 'utf-8');
      this.addToolWorkflow(workflowName, workflowText);
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
    this.workflows[lc] = workflowText;
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

    return this.workflows[lc];
  }

  /**
   * Returns all workflow names
   */
  getWorkflowNames() {
    return Object.keys(this.workflows);
  }

  /**
   * Checks if we have a workflow registered or nor
   */
  hasWorkflow(workflowName: string) {
    return workflowName.toLowerCase() in this.workflows;
  }
}
