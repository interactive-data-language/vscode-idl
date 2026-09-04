/**
 * Configuration for the server
 */
export interface IServerConfig {
  /** Server host */
  host: string;
  /** Language for the server */
  language: 'en';
  /** TCP port the embedded agents server is listening on */
  port: number;
}
