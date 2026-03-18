/**
 * Information for an analytics repository server
 */
export interface IAnalyticsRepositoryInfo {
  /** Password for authentication */
  password?: string;
  /** Server port */
  port?: number;
  /** URL for the server */
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
export interface IAnalyticsRepositorySearchFilter {
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
export interface IPackageMetadata {
  [key: string]: any;
  /** Nested object: first key is filepath in package with task JSON as the value */
  envitasks?: { [key: string]: { [key: string]: any } };
  /** Name and workflow content */
  envitoolworkflows?: { [key: string]: string };
  /** Nested object: first key is filepath in package with task JSON as the value */
  idltasks?: { [key: string]: { [key: string]: any } };
  /** Name and workflow content */
  idltoolworkflows?: { [key: string]: string };
  /** Prompts by name/value of prompt */
  prompts?: { [key: string]: { description: string; prompt: string } };
}

/**
 * Package returned by the analytics repository
 */
export interface IAnalyticsRepositoryPackage {
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
  metadata: IPackageMetadata;
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
export interface IAnalyticsRepositorySearchResponse {
  /** Search filter echoed back from the server */
  filter: IAnalyticsRepositorySearchFilter;
  /** Packages returned for the current page */
  packages: IAnalyticsRepositoryPackage[];
}

/**
 * Aggregated search result for a single server
 */
export interface IAnalyticsRepositorySearchServerResult {
  /** Filter used for the search */
  filter: IAnalyticsRepositorySearchFilter;
  /** All packages found across every requested page */
  packages: IAnalyticsRepositoryPackage[];
  /** Server that produced the package list */
  server: IAnalyticsRepositoryInfo;
}
