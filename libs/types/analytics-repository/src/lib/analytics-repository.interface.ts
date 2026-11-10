/**
 * Information for an analytics repository server
 */
export interface IAnalyticsRepository_ServerInfo {
  /** Static HTTP headers sent with every request */
  headers?: { [key: string]: string };
  /** Password for authentication */
  password?: string;
  /** URL for the server (ex: http://localhost:9194) */
  url: string;
  /** Username for accessing */
  username?: string;
}

/**
 * Information about access token so we can refresh automatically
 */
export interface IAnalyticsRepositoryAccessInfo {
  /** Time we created the token at */
  created: number;
  /** Refresh token */
  refresh: string;
  /** Access token */
  token: string;
}

/**
 * Filter options when searching repository packages
 */
export interface IAnalyticsRepository_SearchFilter {
  /** Author of the package */
  author?: string;
  /** Description of the package */
  description?: string;
  /** Number of results to return per page */
  limit?: number;
  /** Name of the package */
  name?: string;
  /** Page number to search */
  page?: number;
  /** Tags that the package should include */
  tags?: string[];
  /** Package types to include */
  types?: string[];
  /** UID of the package */
  uid?: string;
  /** Version of the package */
  version?: string;
}

/**
 * Package metadata
 */
export interface IAnalyticsRepository_PackageMetadata {
  [key: string]: any;
  /** System instructions */
  agent_instructions?: { [key: string]: string };
  /** Skills by name/value of prompt */
  agent_skills?: { [key: string]: string };
  /** Nested object: first key is filepath in package with task JSON as the value */
  envi_tasks?: { [key: string]: { [key: string]: any } };
  /** Name and workflow content */
  envi_tool_workflows?: { [key: string]: string };
  /** Nested object: first key is filepath in package with task JSON as the value */
  idl_tasks?: { [key: string]: { [key: string]: any } };
  /** Name and workflow content */
  idl_tool_workflows?: { [key: string]: string };
}

/**
 * Package returned by the analytics repository
 */
export interface IAnalyticsRepository_Package {
  /** Author of the package */
  author: string;
  /** Date the package was created or published */
  date: string;
  /** Description of the package */
  description: string;
  /** Human-readable package name */
  display_name: string;
  /** Filename to download */
  filename: string;
  /** Arbitrary package metadata */
  metadata: IAnalyticsRepository_PackageMetadata;
  /** Internal package name */
  name: string;
  /** Size of the package in bytes */
  package_size: number;
  /** Tags attached to the package */
  tags: string[];
  /** Package type */
  type: string;
  /** Unique package identifier */
  uid: string;
  /** Package version */
  version: string;
}

/**
 * Response from the repository search endpoint
 */
export interface IAnalyticsRepository_SearchResponse {
  /** Search filter echoed back from the server */
  filter: IAnalyticsRepository_SearchFilter;
  /** Packages returned for the current page */
  packages: IAnalyticsRepository_Package[];
}

/**
 * Data structure for found packages that bundles the server information in
 * the package so that we always keep them to get them
 */
export interface IAnalyticRepository_ServerPackage {
  /**
   * Folder the package is installed in, only set for packages that were found
   * locally (these do not have a server)
   */
  localPath?: string;
  /**
   * Metadata for the package we found
   */
  package: IAnalyticsRepository_Package;
  /**
   * Access information for the server that the package comes from, undefined
   * for packages that are installed locally
   */
  server?: IAnalyticsRepository_ServerInfo;
}
