/**
 * Track tasks that we skip running
 *
 * Can likely be reduced, was used originally when the implementation was different
 *
 * But there's still some that we don't need to expose to the LLM
 */
export const SKIP_THESE_TASKS: { [key: string]: undefined } = {
  // not something that has value for follow-on processes
  // i.e. why would an LLM run this?
  buildrasterpyramids: undefined,

  // handled via MCP
  findrasters: undefined,

  // handled via MCP
  generatefilename: undefined,
  generateindexarray: undefined,

  // not needed
  getversion: undefined,

  // handled via MCP
  queryalltasks: undefined,
  querytask: undefined,
  querytaskcatalog: undefined,

  // handled via MCP query dataset
  rastermetadataitem: undefined,
  rasterproperties: undefined,

  // not needed
  runtask: undefined,

  // LLM can do this automatically
  stringprocessing: undefined,

  // duplicate - should use ROI statistics
  trainingclassificationstatistics: undefined,
};
