compile_opt idl2

task1 = ENVITask('TrainTensorFlowPixelModel')
task1.model_name = 'Foo'

task2 = ENVITask('TrainTensorFlowObjectModel')
task2.model_name = 'Foo'

task3 = ENVITask('TrainTensorFlowGridModel')
task3.model_name = 'Foo'

task4 = ENVITask('RandomizeParametersForTrainTensorFlowPixelModel')
task5 = ENVITask('TensorFlowObjectClassification')
task6 = ENVITask('TensorFlowOptimizedObjectClassification')
task7 = ENVITask('TensorFlowOptimizedPixelClassification')
task8 = ENVITask('TensorFlowPixelClassification')

end
