compile_opt idl2

task1 = ENVITask('TrainDeepLearningPixelModel')
task1.model_name = 'Foo'

task2 = ENVITask('TrainDeepLearningObjectModel')
task2.model_name = 'Foo'

task3 = ENVITask('TrainDeepLearningGridModel')
task3.model_name = 'Foo'

task4 = ENVITask('RandomizeParametersForTrainDeepLearningPixelModel')
task5 = ENVITask('DeepLearningObjectClassification')
task6 = ENVITask('DeepLearningOptimizedObjectClassification')
task7 = ENVITask('DeepLearningOptimizedPixelClassification')
task8 = ENVITask('DeepLearningPixelClassification')

end
