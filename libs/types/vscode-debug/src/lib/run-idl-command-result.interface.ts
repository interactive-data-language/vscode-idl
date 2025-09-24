export interface IRunIDLCommandResult {
  /** Information about the tool running */
  err?: string;
  /** Output from IDL */
  idlOutput?: string;
  /** Did we run successfully or not */
  success: boolean;
}
