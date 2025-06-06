/**
 * Track tasks that we skip running
 */
export const SKIP_THESE_TASKS: { [key: string]: undefined } = {
  buildrasterpyramids: undefined,

  calculatequacgainoffset: undefined,
  convertinterleave: undefined,

  dicerasterbyvector: undefined,

  emissivityfromalpharesiduals: undefined,
  emissivityfromnormalization: undefined,
  emissivityfromreferencechannel: undefined,
  extractbandsfromraster: undefined,

  findrasters: undefined,

  geopackagetoshapefile: undefined,
  getversion: undefined,

  initializeenvinet5model: undefined,
  initializeenvinet5multimodel: undefined,

  queryalltasks: undefined,
  querytask: undefined,
  querytaskcatalog: undefined,

  randomizetraintensorflowmaskmodel: undefined,
  rastermetadataitem: undefined,
  rasterproperties: undefined,
  runtask: undefined,

  spectralsubspacebackgroundstatistics: undefined,
  stringprocessing: undefined,
  subsetlabelraster: undefined,

  trainingclassificationstatistics: undefined,
  traintensorflowmaskmodel: undefined,
  traintensorflowpixelmodel: undefined,
  traintensorflowobjectmodel: undefined,

  vectortofeaturecount: undefined,
};
