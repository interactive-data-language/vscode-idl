# ENVI DL 3.0 Automatic Code Migration

IDL for VSCode includes a command called "IDL: Migrate Code to ENVI Deep Learning 3.0 API" which will update your code to the latest version of the API.

To learn more about the specific changes, see the official documentation guide: https://www.nv5geospatialsoftware.com/docs/deeplearningmigrationguide.html

## Steps

1. Open a file that used the previous version of the ENVI Deep Learning API

2. Open the Command Palette (Ctrl + Shift + p)

3. Search for "IDL: Migrate Code to ENVI Deep Learning 3.0 API"

4. Press `Enter` to have your code migrated

5. Once finished, your code editor will have the updated code

6. You can then use undo/redo to see what the changes look like

## Code Examples

Below you'll find an example showing what the old/new code looks like:

::: code-group

```idl [Before]
; create a model to train
initTask = ENVItask('InitializeENVINet5MultiModel')
initTask.model_name = 'SkyNet'
initTask.model_description = 'One model to rule them all'
initTask.model_architecture = 'SegUNet++'
initTask.nbands = 4
initTask.nclasses = 5
initTask.patch_size = 464
initTask.execute

; train!
trainTask = ENVITask('TrainTensorFlowMaskModel')
trainTask.input_model = initTask.output_model
trainTask.training_rasters = training
trainTask.validation_rasters = training
trainTask.epochs = 25
trainTask.patches_per_batch = 3
trainTask.patches_per_epoch = 500
trainTask.output_last_model = e.getTemporaryFilename('_last.h5')
trainTask.output_model = e.getTemporaryFilename('_best.h5')
trainTask.execute

; classify an image!
classifyTask = ENVITask('TensorFlowMaskClassification')
classifyTask.input_model = trainTask.output_model
classifyTask.input_raster = raster
classifyTask.output_class_activation_raster_uri = e.getTemporaryFilename()
classifyTask.execute
```

```idl [Migrated]
; train!
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

trainTask.training_rasters = training
trainTask.validation_rasters = training
trainTask.epochs = 25
trainTask.patches_per_batch = 3
trainTask.output_last_model = e.getTemporaryFilename('_last.h5')
trainTask.output_model = e.getTemporaryFilename('_best.h5')
trainTask.execute

; classify an image!
classifyTask = ENVITask('TensorflowPixelClassification')
classifyTask.input_model = trainTask.output_model
classifyTask.input_raster = raster
classifyTask.output_class_activation_raster_uri = e.getTemporaryFilename()
classifyTask.execute

```

:::
