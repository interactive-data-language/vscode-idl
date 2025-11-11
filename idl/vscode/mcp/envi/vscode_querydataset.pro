;+
; :Returns: Hash<any>
;
; :Arguments:
;   dataset: in, required, any
;     The ENVI API dataset we are describing
;
;-
function vscode_queryDataset_Describe, dataset
  compile_opt idl2, hidden

  ;+ get description
  description = dataset.describe()

  ;+
  ; Check for anything special we need to add
  ;-
  case (!true) of
    ;+
    ; Check for raster
    ;-
    isa(dataset, 'ENVIRaster'): begin
      ; try to get the pixel size in helpful units, but not all rasters have spatial references
      if (dataset.spatialref ne !null) then begin
        catch, err
        if (err ne 0) then begin
          catch, /cancel
        endif else begin
          ; get raster center latitude for rasters, leaving code here for reference
          dataset._component.getProperty, center_latitude = refLat

          ;+ extract the spatial reference
          sref = dataset.spatialref

          ; get the raster pixel size
          pixelSize = sref._component.pixel_size

          ; get the units for the spatial reference
          units = sref._component.units

          ; save as meters
          description['pixel size meters'] = IDLcfProjUnitsConvertValue(pixelSize, units, IDLcfProjUnitsTranslate('Meters'), reference_latitude = refLat)
        endelse
        catch, /cancel
      endif
    end
    else: begin
      ; do nothing
    end
  endcase

  return, description
end

;+
; :Arguments:
;   dataset: in, required, String
;     Dehydrated version of a dataset that we try to open
;
;-
pro vscode_queryDataset, dataset
  compile_opt idl2, hidden
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    vscode_reportENVIFailure, /machine, 'envi-not-started', 'ENVI has not started yet and should be. If ENVI was started, you may need to reset your IDL session'
    return
  endif

  ; attempt to parse JSON
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    vscode_reportENVIFailure, /machine, 'envi-error', 'Invalid JSON description of dataset, cannot query'
    return
  endif else begin
    ;+ parse task parameters
    parsed = json_parse(dataset)
  endelse
  catch, /cancel

  ;+ track if we have a raster
  isRaster = strcmp(parsed['factory'], 'urlraster', /fold_case)

  ;+
  ; Attempt to hydrate the dataset
  ;-
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message, output = o
    vscode_reportENVIFailure, /machine, 'envi-error', `Unable to hydrate, ${strjoin(o, `\n`)}`
    return
  endif else begin
    ;+
    ; Special cases for raster data because ENVI apparently can't handle hydrating
    ; multi-raster datasets but you can call ENVI:OpenRaster
    ;-
    case (!true) of
      ~parsed.hasKey('dataset_index') && isRaster: begin
        hydrated = e.openRaster(parsed['url'])
      end
      else: begin
        hydrated = ENVIHydrate(parsed)
      end
    endcase
  endelse
  catch, /cancel

  ; handle errors
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    vscode_reportENVISuccess, /machine, '[{}]'
  endif else begin
    ;+
    ; Check if we have an array of values (i.e. a multi-raster raster)
    ;-
    if isa(hydrated, /array) then begin
      ;+ track all describe calls
      described = list()

      ; process each item
      foreach item, hydrated do described.add, vscode_queryDataset_Describe(item)

      ; report all values
      vscode_reportENVISuccess, /machine, described
    endif else begin
      ; report all values
      vscode_reportENVISuccess, /machine, list(vscode_queryDataset_Describe(hydrated))
    endelse
  endelse
  catch, /cancel
end
