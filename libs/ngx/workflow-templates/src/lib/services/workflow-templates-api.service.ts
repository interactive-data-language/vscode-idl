import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigApiService } from '@idl/ngx/app-config';
import type {
  AgentWorkflowTemplate,
  WorkflowTemplatesResponse,
} from '@idl/types/workflow-templates';
import { map, Observable } from 'rxjs';

/**
 * Service for communicating with the Agent Workflow Templates API
 */
@Injectable({
  providedIn: 'root',
})
export class WorkflowTemplatesApiService {
  private readonly configApi = inject(ConfigApiService);

  /** HTTP client */
  private readonly http = inject(HttpClient);

  /** Base URL for REST API — absolute when running in Electron */
  private get baseUrl(): string {
    return this.configApi.isElectron
      ? `http://localhost:${this.configApi.config.server.port}/api/workflow-templates`
      : '/api/workflow-templates';
  }

  /**
   * Gets the available Agent Workflow Templates
   */
  listTemplates(): Observable<AgentWorkflowTemplate[]> {
    return this.http
      .get<WorkflowTemplatesResponse>(this.baseUrl)
      .pipe(map((resp) => resp.templates));
  }

  // /**
  //  * Gets the names of known automated tool workflows (e.g. ENVI Tool Workflows)
  //  */
  // listToolWorkflowNames(): Observable<string[]> {
  //   return this.http
  //     .get<ToolWorkflowNamesResponse>(`${this.baseUrl}/tool-workflows`)
  //     .pipe(map((resp) => resp.names));
  // }
}
