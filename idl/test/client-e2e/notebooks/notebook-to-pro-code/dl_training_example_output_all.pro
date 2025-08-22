; main level program
compile_opt idl2

; Start ENVI, but with the UI so we can see training progress.
; 
; If you already started ENVI, press the "Stop IDL" button in the top of the notebook and re-run this cell.

;+ start ENVI with the UI
e = envi()

; Get folders for input and output

;+ get this directory
thisDir = file_dirname(routine_filepath())

;+ folder for croc training data
folder = thisDir + path_sep() + 'ec-export'

;+ timestamp for all of our outputs
timestamp = (timestamp()).replace(':', '-')
timestamp = (strsplit(timestamp, '.', /extract))[0]

; specify the folder we will write our results to
modelDir = strjoin([thisDir, 'models-air', timestamp], path_sep())
if ~file_test(modelDir, /directory) then file_mkdir, modelDir

extension = '.dat'

; Where we want the model to go

;+ best model, updated as we go with lowest validation loss
bestUri = modelDir + path_sep() + 'best.h5'

;+ last mode (last epoch of training)
lastUri = modelDir + path_sep() + 'last.h5'

; Training parameters

;+ random seed for splitting data
seed = 17

;+ percentage of training data used for validation
validation = 0.2 ; percent from 0 to 1

;+ background patch ration
bpr = 0.3

;+ how many times we run through all positive examples of our features
epochs = 100

; Load data and split into training and validation buckets

; make list for ENVI DL rasters
rasters = list()

; find files
files = file_search(folder, `*${extension}`, count = nFiles)
if (nFiles eq 0) then message, 'Where are our deep learning rasters?'

; open DL rasters
foreach file, files do rasters.add, ENVIDeepLearningObjectDetectionRaster(file)

; convert to array
rasters = rasters.toArray()

; get the number of rasters for validation
nTraining = floor(nFiles * (1.0 - validation))
nValidation = nFiles - nTraining

; make random index
idx = sort(randomu(seed, nFiles))

; split into training and validation
; training = rasters[idx[0 : nTraining - 1]]
training = rasters[*]
validation = rasters[idx[-nValidation : -1]]

; Create our training task and specify model parameters

; Get the task from the catalog of ENVITasks
Task = ENVITask('TrainTensorFlowObjectModel')

;+ specify the number of samples per step
Task.patches_per_batch = 3

; specify training data and how long to train
Task.training_rasters = training
Task.validation_rasters = validation
Task.epochs = epochs
Task.background_patch_ratio = bpr

; set our outputs
Task.output_model_uri = bestUri
Task.output_last_model_uri = lastUri

Task.execute

Task.execute

Task.execute

orig = e.openRaster('D:\luno\sky-sat\mosaics\SkySatScene.ntf')
raster = dlAutoPrepareRaster(orig)
e.data.add, raster

stop

Task.execute

Task.execute

; Train! Now this will take a while, so don't close VSCode or run any other notebooks.

Task.execute

; Optionally, classify some of our validation images so we can see what our results look like.

; stopped so we dont accidentally process all of our images which will take a while!
stop

; Specify the output folder and open our model

;+ specify output folder
validationDir = modelDir + path_sep() + 'validation'

; make sure it exists
if ~file_test(validationDir, /directory) then file_mkdir, validationDir

; Open our model!

;+ restore the model to process our data with
model = ENVITensorFlowObjectModel(lastUri)

; Process our data!

; specify the number of files to process
nProcess = 10 ; nValidation

;+ get the validation files
validationUris = files[idx[-nValidation : -1]]

; process each file
foreach file, validationUris, i do begin
  ; stop if we need to
  if (i ge nProcess) then break

  ;+ get output file and account for best or last model
  out = validationDir + path_sep() + file_basename(file, '.dat') + (model.uri eq bestUri ? '_best.dat' : '_last.dat')

  ; skip if it exists
  if file_test(out) then continue

  ; alert user
  print, `Processing image ${i + 1} of ${nProcess}`

  ; open as raster
  raster = e.openRaster(file)

  ; process
  Task = ENVITask('TensorFlowObjectClassification')
  Task.input_raster = raster
  Task.input_model = model
  Task.output_classification_raster_uri = out
  Task.execute

  ; clean up
  raster.close
endforeach
end