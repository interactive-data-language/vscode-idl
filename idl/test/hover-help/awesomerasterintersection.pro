; h+
; Copyright (c) 2018 Harris Geospatial Solutions, Inc.
;
; Licensed under MIT. See LICENSE.txt for additional details and information.
; h-

;+
; :Description:
;    Tool for determining the intersection between two rasters based on their
;    spatial reference and spatial extent. Both rasters will also contain only
;    the valid pixels from each scene for  analysis. In other words, if a pixel
;    is `off` in the first image and not the second, it will be turned `off` in
;    each of the output rasters for consistency. If one of the rasters does not
;    have a data ignore value, then a pixel state mask is automatically generated
;    so that you can mask the output rasters if needed.
;
;    The pixel size of the output rasters will be the smallest x and y
;    pixel size from each raster.
;
;
;
; :Examples:
;    ```idl
;    ;start ENVI
;    e = envi(/HEADLESS)
;
;    ;make sure we have access to our ENVI tasks
;    awesomeENVIAlgorithms, /INIT
;
;    ;specify two rasters to process
;    raster1 = e.openRaster(file1)
;    raster2 = e.openRaster(file2)
;
;    ;get our task
;    task = ENVITask('AwesomeRasterIntersection')
;    task.INPUT_RASTER1 = raster1
;    task.INPUT_RASTER2 = raster2
;    task.execute
;
;    ;print our output locations
;    print, task.OUTPUT_RASTER1_URI
;    print, task.OUTPUT_RASTER2_URI
;    ```
;
; :Keywords:
;    DEBUG: in, optional, type=boolean, private
;      If set, errors are stopped on.
;    DATA_IGNORE_VALUE: in, optional, type=number
;      If one or both of your input rasters do not have
;      a data ignore value metadata item, you can specify
;    GENERATE_PIXEL_STATE_MASK: in, optional, type=boolean
;      If set, then an addititonal output raster is created
;      that represents which pixels can be processed or not.
;
;      This will automatically be generated if one of the input
;      images does not have a data ignore value.
;    INPUT_RASTER1: in, required, type=ENVIRaster
;      Specify the first raster to use for intersection.
;    INPUT_RASTER2: in, required, type=ENVIRaster
;      Specify the second raster to use for intersection
;    OUTPUT_GRID_DEFINITION: out, optional, type=ENVIGridDefinition
;      Optionally return the ENVIGridDefinition object used to get the intersection
;      of the two scenes.
;    OUTPUT_RASTER1_URI: in, optional, type=string
;      Optionally specify the fully-qualified filepath
;      for the location of the first intersect raster.
;    OUTPUT_RASTER2_URI: in, optional, type=string
;      Optionally specify the fully-qualified filepath
;      for the location of the second intersect raster.
;    OUTPUT_MASK_RASTER_URI: in, optional, type=string
;      Optionally specify the fully-qualified filepath
;      for the location of the pixel state mask. Only applies
;      when `GENERATE_PIXEL_STATE_MASK` is set or one of the
;      input rasters does not have a data ignore value.
;    RESAMPLING: in, optional, type=string
;      Optionally return the ENVIGridDefinition object used to get the intersection
;      of the two scenes. Specify one of the following options:
;      - Nearest Neighbor
;      - Bilinear
;      - Cubic Convolution
;
; :Tooltip:
;    Calculates the intersection of two rasters such that both
;    have the same spatial extent and spatial dimensions
;
; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;-
pro awesomeRasterIntersection, $
  debug = debug, $
  data_ignore_value = data_ignore_value, $
  generate_pixel_state_mask = generate_pixel_state_mask, $
  input_raster1 = input_raster1, $
  input_raster2 = input_raster2, $
  output_mask_raster_uri = output_mask_raster_uri, $
  output_grid_definition = output_grid_definition, $
  output_raster1_uri = output_raster1_uri, $
  output_raster2_uri = output_raster2_uri, $
  resampling = resampling
  compile_opt idl2, hidden
end