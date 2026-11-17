;+
; :Arguments:
;   dir: in, required, String
;     Package directory
;   metadata: in, required, Hash<any>
;     Package metadata
;   models: in, required, List<String>
;     The declared models
;
;-
pro vscode_createManifest_manageENVIMachineLearningModels, dir, metadata, models
  compile_opt idl2, hidden
  on_error, 2

  ; return if nothing to save
  if (n_elements(models) eq 0) then return

  ;+ create prompt metadata
  modelMeta = orderedhash()

  ; process each configured task
  foreach model, models do begin
    ;+ get path
    modelUri = strjoin([dir, model], path_sep())

    ; make sure it exists
    if ~file_test(modelUri) then message, `Declared ENVI Machine Learning Model file doesn't exist: ${modelUri}`

    modelObj = ENVIMachineLearningModel(modelUri)

    ; save task definition
    modelMeta[model] = modelObj.describe()
  endforeach

  ; save metadata
  metadata['envi_machine_learning_models'] = modelMeta
end
