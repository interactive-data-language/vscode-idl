compile_opt idl2

e = envi()

; get the folder with our data
thisdir = file_dirname(routine_filepath())

trainingRaster = thisdir + path_sep() + 'hyogo_japan_ashiya_city_subset_stacked.dat'

if ~file_test(trainingRaster) then begin
  raster = e.openRaster(thisdir + path_sep() + 'hyogo_japan_ashiya_city_subset.dat')
  rois = e.openROI(thisdir + path_sep() + 'hyogo_japan_ashiya_city_rois.xml')
  Task = ENVITask('BuildLabelRasterFromROI')
  Task.input_raster = raster
  Task.input_ROI = rois
  Task.output_raster_uri = trainingRaster
  Task.execute

  ; clean up
  raster.close
  foreach roi, rois do roi.close
endif

raster = ENVIDeepLearningLabelRaster(trainingRaster)

; Get the task from the catalog of ENVITasks
trainTask = ENVITask('TrainTensorFlowMaskModel')
trainTask.input_model = initTask.output_model
trainTask.training_rasters = raster
trainTask.validation_rasters = raster
; trainTask.CLASS_WEIGHT = [0,2]
trainTask.epochs = 20
trainTask.patches_per_epoch = 150
trainTask.patches_per_batch = 4
trainTask.patch_sampling_rate = 8
trainTask.solid_distance = [0]
trainTask.loss_weight = 0.0
trainTask.execute

classifyRaster = thisdir + path_sep() + 'hyogo_japan_ashiya_ity_sub_classify.dat'

Task = ENVITask('TensorflowMaskClassification')
Task.input_model = trainTask.output_model
Task.input_raster = e.openRaster(classifyRaster)
Task.output_classification_raster_uri = e.getTemporaryFilename(/cleanup_on_exit)
Task.execute
e.data.add, Task.output_classification_raster

end