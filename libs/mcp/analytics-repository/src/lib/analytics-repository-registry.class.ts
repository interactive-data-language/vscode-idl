import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { IDL_PACKAGE_DIR } from '@idl/idl/files';
import type {
  IAnalyticRepository_ServerPackage,
  IAnalyticsRepository_Package,
  IAnalyticsRepository_SearchFilter,
  IAnalyticsRepository_SearchResponse,
  IAnalyticsRepository_ServerInfo,
} from '@idl/types/analytics-repository';
import axios, { type AxiosResponse } from 'axios';

import { REPOSITORY_TAGS } from './analytics-repository-registry.interface';
import { MatchesFilter } from './matches-filter';

export class AnalyticsRepositoryRegistry {
  /**
   * Folder with locally installed packages, where each package is a
   * sub-folder with a "manifest.json" file
   */
  private localDir = IDL_PACKAGE_DIR;

  /**
   * Track servers
   */
  private servers: IAnalyticsRepository_ServerInfo[] = [];

  constructor(servers: IAnalyticsRepository_ServerInfo[] = []) {
    this.servers = servers;
  }

  /**
   * Adds a server to search
   */
  addServer(server: IAnalyticsRepository_ServerInfo) {
    this.servers.push(server);
  }

  /**
   * Retrieve packages that have instructions
   */
  async getAgentInstructionPackages() {
    return await this.searchRepositories({
      tags: [REPOSITORY_TAGS.AGENT_INSTRUCTIONS],
    });
  }

  /**
   * Retrieve packages that have skills
   */
  async getAgentSkillPackages() {
    return await this.searchRepositories({
      tags: [REPOSITORY_TAGS.AGENT_SKILL],
    });
  }

  /**
   * Retrieve packages that have ENVI Tasks
   */
  async getENVITaskPackages() {
    return await this.searchRepositories({
      tags: [REPOSITORY_TAGS.ENVI_TASK],
    });
  }

  /**
   * Retrieve packages that have ENVI Tool Workflows
   */
  async getENVIToolWorkflowPackages() {
    return await this.searchRepositories({
      tags: [REPOSITORY_TAGS.ENVI_TOOL_WORKFLOW],
    });
  }

  /**
   * Retrieve packages that have IDL Tasks
   */
  async getIDLTaskPackages() {
    return await this.searchRepositories({
      tags: [REPOSITORY_TAGS.IDL_TASK],
    });
  }

  /**
   * Retrieve packages that have IDL Tool Workflows
   */
  async getIDLToolWorkflowPackages() {
    return await this.searchRepositories({
      tags: [REPOSITORY_TAGS.IDL_TOOL_WORKFLOW],
    });
  }

  /**
   * Reads the packages that are installed locally
   *
   * Each sub-folder of the local directory is a package with a "manifest.json"
   * file that has the same structure as a package from a server. Folders
   * without a valid manifest are skipped.
   */
  async getLocalPackages(): Promise<IAnalyticRepository_ServerPackage[]> {
    /**
     * Track candidate folders that have packages
     */
    let folders: string[];
    try {
      folders = (await readdir(this.localDir, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch {
      return [];
    }

    /** Track found packages */
    const found: IAnalyticRepository_ServerPackage[] = [];

    // process each folder
    for (const folder of folders) {
      const localPath = join(this.localDir, folder);
      try {
        const manifest = JSON.parse(
          await readFile(join(localPath, 'manifest.json'), 'utf-8'),
        ) as IAnalyticsRepository_Package;

        // validate local manifest file
        if (
          typeof manifest?.name !== 'string' ||
          typeof manifest?.version !== 'string'
        ) {
          continue;
        }

        // save package information
        found.push({
          localPath,
          package: { ...manifest, metadata: manifest.metadata || {} },
        });
      } catch {
        // missing or invalid manifest, not a package we can use
      }
    }

    return found;
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
   * Search locally installed packages and all configured analytics
   * repositories and retrieve all package matches based on filters
   *
   * Only one version of a package can be installed, so locally installed
   * packages always win and remote packages with the same name are dropped.
   *
   * Returns all pages
   */
  async searchRepositories(
    filter: IAnalyticsRepository_SearchFilter = {},
  ): Promise<IAnalyticRepository_ServerPackage[]> {
    const local = await this.getLocalPackages();

    /** Names of everything installed, regardless of the filter */
    const installed = new Set(
      local.map((item) => item.package.name.toLowerCase()),
    );

    // find remote packages
    // filter our local installed packages by name
    const remote = (
      await Promise.all(
        this.servers.map((server) =>
          this.searchServerRepositories(server, filter),
        ),
      )
    )
      .flat()
      .filter((item) => !installed.has(item.package.name.toLowerCase()));

    return [
      ...local.filter((item) => MatchesFilter(item.package, filter)),
      ...remote,
    ];
  }

  /**
   * Sets the folder with locally installed packages
   */
  setLocalDir(dir: string) {
    this.localDir = dir;
  }

  /**
   * Replaces all servers, such as when the configuration changes
   */
  setServers(servers: IAnalyticsRepository_ServerInfo[]) {
    this.servers = [...servers];
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
    const limit = filter.limit || 100;

    /** Track packages we return */
    const packages: IAnalyticsRepository_Package[] = [];

    /** Page we are on */
    let page = filter.page || 0;

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
                password: server.password || '',
                username: server.username || '',
              }
            : undefined,
        headers: server.headers,
        responseType: 'json',
      });
      const responsePackages = response.data.packages || [];

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
