compile_opt idl2

task1 = ENVITask('TrainDeepLearningPixelModel')

; ================================================
; TODO: review new/required parameters
; see the documentation for more information

; Set name of model (now a required parameter during training instead of optional)
task1.model_name = 'My Awesome Model'
; ================================================


task2 = ENVITask('TrainDeepLearningObjectModel')

; ================================================
; TODO: review new/required parameters
; see the documentation for more information

; Set name of model (now a required parameter during training instead of optional)
task2.model_name = 'My Awesome Model'
; ================================================


task3 = ENVITask('TrainDeepLearningGridModel')

; ================================================
; TODO: review new/required parameters
; see the documentation for more information

; Set name of model (now a required parameter during training instead of optional)
task3.model_name = 'My Awesome Model'
; ================================================


task4 = ENVITask('RandomizeParametersForTrainDeepLearningPixelModel')
task5 = ENVITask('DeepLearningObjectClassification')
task6 = ENVITask('DeepLearningOptimizedObjectClassification')
task7 = ENVITask('DeepLearningOptimizedPixelClassification')
task8 = ENVITask('DeepLearningPixelClassification')

end
