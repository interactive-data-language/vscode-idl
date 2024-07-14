
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
initTask = ENVITask('InitializeENVINet5MultiModel')
initTask.NBANDS = 3
initTask.NCLASSES = 1
initTask.MODEL_ARCHITECTURE = 'SegUNet'
initTask.PATCH_SIZE = 256
initTask.Execute

; Get the task from the catalog of ENVITasks
trainTask = ENVITask('TrainTensorFlowMaskModel')
trainTask.INPUT_MODEL = initTask.OUTPUT_MODEL
trainTask.TRAINING_RASTERS = raster
trainTask.VALIDATION_RASTERS = raster
;trainTask.CLASS_WEIGHT = [0,2]
trainTask.EPOCHS = 20
trainTask.PATCHES_PER_EPOCH = 150
traintask.PATCHES_PER_BATCH = 4
trainTask.PATCH_SAMPLING_RATE = 8
trainTask.SOLID_DISTANCE = [0]
trainTask.LOSS_WEIGHT = 0.0
trainTask.Execute

classifyRaster = thisdir + path_sep() + 'hyogo_japan_ashiya_ity_sub_classify.dat'

task = ENVITask('TensorflowMaskClassification')
task.INPUT_MODEL = trainTask.OUTPUT_MODEL
task.INPUT_RASTER = e.openRaster(classifyRaster)
task.OUTPUT_CLASSIFICATION_RASTER_URI = e.GetTemporaryFilename(/CLEANUP_ON_EXIT)
task.execute
e.data.add, task.OUTPUT_CLASSIFICATION_RASTER


end