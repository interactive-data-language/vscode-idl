import type { WorkflowTemplatesResponse } from '@idl/types/workflow-templates';
import { Router } from 'express';

import { WORKFLOW_TEMPLATES } from '../helpers/workflow-templates.interface';

/**
 * Create Agent Workflow Template routes
 */
export function CreateWorkflowTemplatesRoutes(): Router {
  const router = Router();

  /**
   * GET /api/workflow-templates
   * Returns the available Agent Workflow Templates.
   */
  router.get('/', (_req, res) => {
    try {
      const resp: WorkflowTemplatesResponse = {
        templates: WORKFLOW_TEMPLATES,
      };

      res.json(resp);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list workflow templates',
      });
    }
  });

  // /**
  //  * GET /api/workflow-templates/tool-workflows
  //  * Returns the names of known automated tool workflows (ENVI Tool Workflows).
  //  */
  // router.get('/tool-workflows', (_req, res) => {
  //   try {
  //     const resp: ToolWorkflowNamesResponse = {
  //       names: ENVI_TOOL_WORKFLOW_REGISTRY.getWorkflowNames(),
  //     };

  //     res.json(resp);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({
  //       error:
  //         error instanceof Error
  //           ? error.message
  //           : 'Failed to list tool workflows',
  //     });
  //   }
  // });

  return router;
}
