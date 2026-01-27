/** Parameters from ENVI report */
export interface IENVISuccess {
  /** Full reason why error */
  error?: string;
  /** Success response, likely array, object, string, or combination of each */
  payload?: any;
  /** Short reason why error */
  reason?: string;
  /** If we succeeded or not */
  succeeded: boolean;
}
