
compile_opt idl2

e = envi()

; get the folder with our data
thisdir = file_dirname(routine_filepath())

trainingRaster = thisdir + path_sep() + 'hyogo_japan_ashiya_city_subset_stacked.dat'

if ~file_test(trainingRaster) then begin
  raster = e.openRaster(thisdir + path_sep() + 'hyogo_japan_ashiya_city_subset.dat')
  rois = e.openROI(thisdir + path_sep() + 'hyogo_japan_ashiya_city_rois.xml')
  Task = ENVITask('BuildLabelRasterFromROI')
  Task.INPUT_RASTER = Raster
  Task.INPUT_ROI = rois
  task.output_raster_uri = trainingRaster
  Task.Execute

  ; clean up
  raster.close
  foreach roi, rois do roi.close
endif

raster = ENVIDeepLearningLabelRaster(trainingRaster)

; Initialize a new model

; Get the task from the catalog of ENVITasks
trainTask = ENVITask('TrainTensorFlowPixelModel')

; ================================================
; TODO: review new parameters
; see the migration guide in the help for more information

; the type of model that we use
trainTask.MODEL_ARCHITECTURE = 'SegUNet'

; the patch size (how much data we see at once)
trainTask.PATCH_SIZE = 256

; train on X% of our examples within the training rasters
trainTask.feature_patch_percentage = 1.0 ; 1.0 = 100%

; for every 100 examples of features,
; how many examples of the background get added during training?
trainTask.background_patch_ratio = 0.2 ; 0.2 = 20%
; ================================================

trainTask.TRAINING_RASTERS = raster
trainTask.VALIDATION_RASTERS = raster
;trainTask.CLASS_WEIGHT = [0,2]
trainTask.EPOCHS = 20
traintask.PATCHES_PER_BATCH = 4
trainTask.SOLID_DISTANCE = [0]
trainTask.LOSS_WEIGHT = 0.0
trainTask.Execute

classifyRaster = thisdir + path_sep() + 'hyogo_japan_ashiya_ity_sub_classify.dat'

task = ENVITask('TensorflowPixelClassification')
task.INPUT_MODEL = trainTask.OUTPUT_MODEL
task.INPUT_RASTER = e.openRaster(classifyRaster)
task.OUTPUT_CLASSIFICATION_RASTER_URI = e.GetTemporaryFilename(/CLEANUP_ON_EXIT)
task.execute
e.data.add, task.OUTPUT_CLASSIFICATION_RASTER


end