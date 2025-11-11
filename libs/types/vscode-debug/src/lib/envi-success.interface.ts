/** Parameters from ENVI report */
export interface IENVISuccess {
  /** Full reason why error */
  error?: string;
  /** Success response */
  payload?: { [key: string]: any };
  /** Short reason why error */
  reason?: string;
  /** If we succeeded or not */
  succeeded: boolean;
}
