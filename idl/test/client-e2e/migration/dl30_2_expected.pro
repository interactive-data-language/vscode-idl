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
trainTask = ENVITask('TrainTensorFlowPixelModel')

; ================================================
; TODO: review new parameters
; see the migration guide in the help for more information

; the type of model that we use
trainTask.model_architecture = 'SegUNet++'

; the patch size (how much data we see at once)
trainTask.patch_size = 464

; train on X% of our examples within the training rasters
trainTask.feature_patch_percentage = 1.0 ; 1.0 = 100%

; for every 100 examples of features,
; how many examples of the background get added during training?
trainTask.background_patch_ratio = 0.2 ; 0.2 = 20%
; ================================================

trainTask.training_rasters = raster
trainTask.validation_rasters = raster
; trainTask.CLASS_WEIGHT = [0,2]
trainTask.epochs = 20
trainTask.patches_per_batch = 4
trainTask.solid_distance = [0]
trainTask.loss_weight = 0.0
trainTask.execute

classifyRaster = thisdir + path_sep() + 'hyogo_japan_ashiya_ity_sub_classify.dat'

Task = ENVITask('TensorflowPixelClassification')
Task.input_model = trainTask.output_model
Task.input_raster = e.openRaster(classifyRaster)
Task.output_classification_raster_uri = e.getTemporaryFilename(/cleanup_on_exit)
Task.execute
e.data.add, Task.output_classification_raster

end