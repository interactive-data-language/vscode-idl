import axios, { AxiosResponse } from 'axios';

import {
  IAnalyticsRepositoryAccessInfo,
  IAnalyticsRepositoryInfo,
  IAnalyticsRepositoryPackage,
  IAnalyticsRepositorySearchFilter,
  IAnalyticsRepositorySearchResponse,
  IAnalyticsRepositorySearchServerResult,
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
      tags: ['envitasks'],
    });
  }

  /**
   * Retrieve packages that have ENVI Tool Workflows
   */
  async getENVIToolWorkflowPackages() {
    return await this.searchRepositories({
      tags: ['envitoolworkflows'],
    });
  }

  /**
   * Retrieve packages that have IDL Tasks
   */
  async getIDLTaskPackages() {
    return await this.searchRepositories({
      tags: ['idltasks'],
    });
  }

  /**
   * Retrieve packages that have IDL Tool Workflows
   */
  async getIDLToolWorkflowPackages() {
    return await this.searchRepositories({
      tags: ['idltoolworkflows'],
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
  ): Promise<IAnalyticsRepositorySearchServerResult[]> {
    return Promise.all(
      this.servers.map((server) =>
        this.searchServerRepositories(server, filter)
      )
    );
  }

  /**
   * Searches all configured analytics repository servers
   */
  private async searchServerRepositories(
    server: IAnalyticsRepositoryInfo,
    filter: IAnalyticsRepositorySearchFilter
  ): Promise<IAnalyticsRepositorySearchServerResult> {
    /** Clean URL */
    const baseUrl = server.url.replace(/\/$/, '');

    /** Get search endpoint */
    const endpoint =
      server.port !== undefined
        ? `${baseUrl}:${server.port}/api/search/packages`
        : `${baseUrl}/api/search/packages`;

    /** Start page */
    const initialPage = filter.page ?? 0;

    /** Start limit for response */
    const limit = filter.limit ?? 100;

    /** Track packages we return */
    const packages: IAnalyticsRepositoryPackage[] = [];

    /** Page we are on */
    let page = filter.page ?? 0;

    /** Flag that we have more pages to search */
    let hasMorePages = true;

    /**
     * Search recursively for packages
     */
    while (hasMorePages) {
      /** Build filter for our request */
      const requestFilter: IAnalyticsRepositorySearchFilter = {
        ...filter,
        limit,
        page,
      };

      /** Search for packages */
      const response = await axios.get<
        IAnalyticsRepositorySearchResponse,
        AxiosResponse<IAnalyticsRepositorySearchResponse>,
        IAnalyticsRepositorySearchFilter
      >(endpoint, {
        auth:
          server.username !== undefined || server.password !== undefined
            ? {
                password: server.password ?? '',
                username: server.username ?? '',
              }
            : undefined,
        data: requestFilter,
      });
      const responsePackages = response.data.packages ?? [];

      // save packages that we get back
      packages.push(...response.data.packages);

      // if we have more pages, increment our page and recurse
      if (responsePackages.length > 0) {
        hasMorePages = true;
        page += 1;
      }
    }

    return {
      filter: {
        ...filter,
        limit,
        page: initialPage,
      },
      packages,
      server,
    };
  }
}
