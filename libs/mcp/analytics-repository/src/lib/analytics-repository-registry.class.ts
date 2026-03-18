import axios, { AxiosResponse } from 'axios';

import {
  IAnalyticRepositoryServerPackage,
  IAnalyticsRepositoryAccessInfo,
  IAnalyticsRepositoryInfo,
  IAnalyticsRepositoryPackage,
  IAnalyticsRepositorySearchFilter,
  IAnalyticsRepositorySearchResponse,
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
  private servers: IAnalyticsRepositoryInfo[] = [];

  constructor(servers: IAnalyticsRepositoryInfo[] = []) {
    this.servers = servers;
    this.accessInfo = servers.map(() => undefined);
  }

  /**
   *
   */
  addServer(server: IAnalyticsRepositoryInfo) {
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
    filter: IAnalyticsRepositorySearchFilter = {}
  ): Promise<IAnalyticRepositoryServerPackage[]> {
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
    server: IAnalyticsRepositoryInfo,
    filter: IAnalyticsRepositorySearchFilter
  ): Promise<IAnalyticRepositoryServerPackage[]> {
    /** Clean URL */
    const baseUrl = server.url.replace(/\/$/, '');

    /** Get search endpoint */
    const endpoint = `${baseUrl}/api/search/packages`;

    /** Start limit for response */
    const limit = filter.limit ?? 100;

    /** Track packages we return */
    const packages: IAnalyticsRepositoryPackage[] = [];

    /** Page we are on */
    let page = filter.page ?? 0;

    /**
     * Search recursively for packages
     */
    // eslint-disable-next-line no-constant-condition
    while (true) {
      /** Build filter for our request */
      const requestFilter: IAnalyticsRepositorySearchFilter = {
        ...filter,
        limit,
        page,
      };

      /** Search for packages */
      const response = await axios.post<
        IAnalyticsRepositorySearchResponse,
        AxiosResponse<IAnalyticsRepositorySearchResponse>,
        IAnalyticsRepositorySearchFilter
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
