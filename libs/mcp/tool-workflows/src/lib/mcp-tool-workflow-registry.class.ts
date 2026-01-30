/**
 * Helper class that tracks and manages access to tool workflows
 */
export class MCPToolWorkflowRegistry {
  /**
   * Lookup of tool workflows by name and value
   *
   * No description, the names should be short, concise, and descriptive
   * like a title to a web page
   */
  private workflows: { [key: string]: string } = {};

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
  addToolWorkflow(workflowName: string, workflowText: string) {
    // get lower case
    const lc = workflowName.toLowerCase();

    // make sure we have an array of notes
    this.workflows[lc] = workflowText;
  }

  /**
   * Gets a tool workflow by name
   */
  getWorkflow(workflowName: string): string {
    /** Get lower case name */
    const lc = workflowName.toLowerCase();

    // return if no match
    if (!(lc in this.workflows)) {
      return;
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
