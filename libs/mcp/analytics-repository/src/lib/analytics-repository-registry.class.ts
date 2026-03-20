import axios, { AxiosResponse } from 'axios';

import {
  IAnalyticRepository_ServerPackage,
  IAnalyticsRepository_Package,
  IAnalyticsRepository_SearchFilter,
  IAnalyticsRepository_SearchResponse,
  IAnalyticsRepository_ServerInfo,
  IAnalyticsRepositoryAccessInfo,
} from './analytics-repository-registry.interface';

export class AnalyticsRepositoryRegistry {
  /**
   * Track server access information
   *
   * Literal value of "undefined" if we haven't retrieved the
   * value already
   */
  private accessInfo: (IAnalyticsRepositoryAccessInfo | undefined)[] = [];

  /**
   * Track servers
   */
  private servers: IAnalyticsRepository_ServerInfo[] = [];

  constructor(servers: IAnalyticsRepository_ServerInfo[] = []) {
    this.servers = servers;
    this.accessInfo = servers.map(() => undefined);
  }

  /**
   *
   */
  addServer(server: IAnalyticsRepository_ServerInfo) {
    this.servers.push(server);
    this.accessInfo.push(undefined);
  }

  /**
   * Retrieve packages that have ENVI Tasks
   */
  async getENVITaskPackages() {
    return await this.searchRepositories({
      tags: ['ENVI Task'],
    });
  }

  /**
   * Retrieve packages that have ENVI Tool Workflows
   */
  async getENVIToolWorkflowPackages() {
    return await this.searchRepositories({
      tags: ['ENVI Tool Workflow'],
    });
  }

  /**
   * Retrieve packages that have IDL Tasks
   */
  async getIDLTaskPackages() {
    return await this.searchRepositories({
      tags: ['IDL Task'],
    });
  }

  /**
   * Retrieve packages that have IDL Tool Workflows
   */
  async getIDLToolWorkflowPackages() {
    return await this.searchRepositories({
      tags: ['IDL Tool Workflow'],
    });
  }

  /**
   * Search all configured analytics repositories and retrieve
   * all package matches based on filters
   *
   * Returns all pages
   */
  async searchRepositories(
    filter: IAnalyticsRepository_SearchFilter = {}
  ): Promise<IAnalyticRepository_ServerPackage[]> {
    return (
      await Promise.all(
        this.servers.map((server) =>
          this.searchServerRepositories(server, filter)
        )
      )
    ).flat();
  }

  /**
   * Searches all configured analytics repository servers
   */
  private async searchServerRepositories(
    server: IAnalyticsRepository_ServerInfo,
    filter: IAnalyticsRepository_SearchFilter
  ): Promise<IAnalyticRepository_ServerPackage[]> {
    /** Clean URL */
    const baseUrl = server.url.replace(/\/$/, '');

    /** Get search endpoint */
    const endpoint = `${baseUrl}/api/search/packages`;

    /** Start limit for response */
    const limit = filter.limit ?? 100;

    /** Track packages we return */
    const packages: IAnalyticsRepository_Package[] = [];

    /** Page we are on */
    let page = filter.page ?? 0;

    /**
     * Search recursively for packages
     */
    // eslint-disable-next-line no-constant-condition
    while (true) {
      /** Build filter for our request */
      const requestFilter: IAnalyticsRepository_SearchFilter = {
        ...filter,
        limit,
        page,
      };

      /** Search for packages */
      const response = await axios.post<
        IAnalyticsRepository_SearchResponse,
        AxiosResponse<IAnalyticsRepository_SearchResponse>,
        IAnalyticsRepository_SearchFilter
      >(endpoint, requestFilter, {
        auth:
          server.username !== undefined || server.password !== undefined
            ? {
                password: server.password ?? '',
                username: server.username ?? '',
              }
            : undefined,
        responseType: 'json',
      });
      const responsePackages = response.data.packages ?? [];

      // save packages that we get back
      packages.push(...responsePackages);

      // if we have more pages, increment our page and recurse
      if (responsePackages.length === 0) {
        break;
      }

      // increment page
      page += 1;
    }

    // embed server information and return
    return packages.map((pkg) => {
      return { ...pkg, server };
    });
  }
}
