compile_opt idl2

task1 = ENVITask('TrainTensorFlowPixelModel')

task2 = ENVITask('TrainTensorFlowObjectModel')

task3 = ENVITask('TrainTensorFlowGridModel')

task4 = ENVITask('RandomizeParametersForTrainTensorFlowPixelModel')
task5 = ENVITask('TensorFlowObjectClassification')
task6 = ENVITask('TensorFlowOptimizedObjectClassification')
task7 = ENVITask('TensorFlowOptimizedPixelClassification')
task8 = ENVITask('TensorFlowPixelClassification')

end
