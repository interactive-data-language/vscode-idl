function testinclude
  compile_opt idl2

  !null = a

  ; use local variables from this routine, not below
  !null = 

  ; use local variables from this routine, not below
  
  return, !null
end

compile_opt idl2
on_error, 2

a = 5

e = envi(/headless)

;+ raster to process
raster = e.openRaster('E:\machine-learning\anomaly-detection-ships\longbeach1.dat')

; - rois that our data comes from
rois = e.openROI('C:\Users\znorman\Desktop\training.xml')

;+ get normalization stats
normTask = ENVITask('NormalizationStatistics')
normTask.input_rasters = [raster]
normTask.execute

;+ get training data from ROIs and raster
trainingDataTask = ENVITask('MLTrainingDataFromROIs')
trainingDataTask.input_raster = raster
trainingDataTask.input_roi = rois
trainingDataTask.normalize_min_max = normTask.normalization
trainingDataTask.execute

; track the OOB errors
oobs = list()

; get number of estimators
foreach val, [15 : 200 : 5] do begin
  ; print some progress
  print, `Number of estimators: ${val}`

  ; training task
  rfTask = ENVITask('TrainRandomForest')
  rfTask.input_rasters = trainingDataTask.output_raster
  rfTask.num_estimators = val
  rfTask.oob_score = !true
  rfTask.execute

  ; parse the model file
  parsed = json_parse(rfTask.output_model_uri, /fold_case)

  ; get and save the OOB score
  oobs.add, parsed['statistics', 'report', 'oob_score']
endforeach

; plot our data
p = plot([15 : 200 : 5], 1 - oobs.toArray(), title = 'OOB Score')
ax = p.axes
ax[0].title = 'Num. Estimators'
ax[1].title = 'OOB Error Rate'

end