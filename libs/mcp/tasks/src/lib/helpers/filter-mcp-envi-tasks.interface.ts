/**
 * Track tasks that we skip running
 *
 * Can likely be reduced, was used originally when the implementation was different
 *
 * But there's still some that we don't need to expose to the LLM
 *
 *
 * IF YOU UPDATE THIS, YOU MUST MAKE SURE THIS TEST FILE IS STILL OK
 *
 * REMOVING ITEMS FROM THIS LIST WILL BREAK SOME REGRESSION TESTS IF WE RELY ON THE TASKS
 *
 * apps/test/test-client/src/tests/mcp/tools/envi/regression-tests/regression-test-these.interface.ts
 */
export const SKIP_THESE_TASKS: { [key: string]: undefined } = {
  // catalog tools don't work out of the box
  // no defaults and the agent doesnt run them right
  // because it cant easily use the ENVI Catalog (literal with ENVI)
  exportcatalogtokml: undefined,
  exportcatalogtostac: undefined,
  mergecatalogs: undefined,
  populatecatalog: undefined,
  prunecatalog: undefined,
  querycatalog: undefined,
  scanfilesforcatalog: undefined,
  startenvicatalogserver: undefined,

  // not something that has value for follow-on processes
  // i.e. why would an LLM run this?
  buildrasterpyramids: undefined,

  // will be automatically handled by MCP
  downloadfromrepository: undefined,
  publishtorepository: undefined,

  // not an edit - use setrastermetadata
  editrastermetadata: undefined,

  // no conversion utilities
  enviuritoannotation: undefined,

  // handled via MCP and file system searching
  findrasters: undefined,
  findvectors: undefined,

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

  // deprecated
  registerrasterwithgeoserver: undefined,
  registervectorwithgeoserver: undefined,

  // not needed
  runtask: undefined,

  // not needed
  startenviserver: undefined,

  // LLM can do this automatically
  stringprocessing: undefined,

  // not agent-enabled yet
  submitscheduledjob: undefined,

  // duplicate - should use ROI statistics
  trainingclassificationstatistics: undefined,
};
