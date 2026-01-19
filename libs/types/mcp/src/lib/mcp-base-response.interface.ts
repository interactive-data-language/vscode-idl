export interface IMCPTool_BaseResponse {
  /**
   * String version of error that was caught
   */
  err?: string;
  /**
   * Did our process finish successfully or not?
   */
  success: boolean;
}
