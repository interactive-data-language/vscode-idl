import type {
  IAnalyticRepository_ServerPackage,
  IAnalyticsRepository_Package,
  IAnalyticsRepository_SearchFilter,
  IAnalyticsRepository_SearchResponse,
  IAnalyticsRepository_ServerInfo,
  IAnalyticsRepositoryAccessInfo,
} from '@idl/types/analytics-repository';
import axios, { type AxiosResponse } from 'axios';

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
   * Adds a server to search
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
   * Retrieve packages that have instructions
   */
  async getInstructionPackages() {
    return await this.searchRepositories({
      tags: ['Instructions'],
    });
  }

  /**
   * Retrieves a specific package version from a server, or undefined if
   * we can't find it
   */
  async getPackage(
    url: string,
    name: string,
    version: string,
  ): Promise<IAnalyticRepository_ServerPackage | undefined> {
    const clean = (value: string) => value.replace(/\/$/, '');

    /** Find the server we need to talk to, so we have the headers */
    const server = this.servers.find((item) => clean(item.url) === clean(url));
    if (!server) {
      return undefined;
    }

    const found = await this.searchServerRepositories(server, {
      name,
      version,
    });

    return found.find(
      (item) => item.package.name === name && item.package.version === version,
    );
  }

  /**
   * Retrieve packages that have skills
   */
  async getSkillPackages() {
    return await this.searchRepositories({
      tags: ['Skill'],
    });
  }

  /**
   * Search all configured analytics repositories and retrieve
   * all package matches based on filters
   *
   * Returns all pages
   */
  async searchRepositories(
    filter: IAnalyticsRepository_SearchFilter = {},
  ): Promise<IAnalyticRepository_ServerPackage[]> {
    return (
      await Promise.all(
        this.servers.map((server) =>
          this.searchServerRepositories(server, filter),
        ),
      )
    ).flat();
  }

  /**
   * Replaces all servers, such as when the configuration changes
   */
  setServers(servers: IAnalyticsRepository_ServerInfo[]) {
    this.servers = [...servers];
    this.accessInfo = servers.map(() => undefined);
  }

  /**
   * Searches all configured analytics repository servers
   */
  private async searchServerRepositories(
    server: IAnalyticsRepository_ServerInfo,
    filter: IAnalyticsRepository_SearchFilter,
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
        headers: server.headers,
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
      return { package: pkg, server };
    });
  }
}

/**
 * Global singleton instance of the analytics repository registry
 */
export const ANALYTICS_REPOSITORY_REGISTRY = new AnalyticsRepositoryRegistry();
