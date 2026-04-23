import { IAutoENVIModelerTest } from '../tests.interface';
import { AUTO_ENVI_MODELER_TEST_ADD_AGGREGATORS } from './envi-modeler-workflows/add-aggregators';
import { AUTO_ENVI_MODELER_TEST_BAD_DIRECTION } from './envi-modeler-workflows/bad-direction';
import { AUTO_ENVI_MODELER_TEST_BAD_EDGES } from './envi-modeler-workflows/bad-edges';
import { AUTO_ENVI_MODELER_TEST_CHANGE_DETECTION } from './envi-modeler-workflows/change-detection';
import { AUTO_ENVI_MODELER_TEST_CHANGE_DETECTION_ML } from './envi-modeler-workflows/change-detection-ml';
import { AUTO_ENVI_MODELER_TEST_CORRECT_OUTPUT } from './envi-modeler-workflows/correct-output';
import { AUTO_ENVI_MODELER_TEST_DATASET_INDEX } from './envi-modeler-workflows/dataset-index';
import { AUTO_ENVI_MODELER_TEST_DEEP_LEARNING } from './envi-modeler-workflows/deep-learning';
import { AUTO_ENVI_MODELER_TEST_IMAGE_CLASSIFICATION_ML } from './envi-modeler-workflows/image-classification-ml';
import { AUTO_ENVI_MODELER_TEST_IMAGE_REGISTRATION } from './envi-modeler-workflows/image-registration';
import { AUTO_ENVI_MODELER_TEST_ISODATA_WITH_URI } from './envi-modeler-workflows/isodata-with-uri';
import { AUTO_ENVI_MODELER_TEST_ORTHORECTIFICATION } from './envi-modeler-workflows/orthorectification';
import { AUTO_ENVI_MODELER_TEST_PARAMS_BAD } from './envi-modeler-workflows/params-bad';
import { AUTO_ENVI_MODELER_TEST_SELECTIVE_DOWNSAMPLING } from './envi-modeler-workflows/selective-downsampling';
import { AUTO_ENVI_MODELER_TEST_SPECTRAL_INDEX_ISODATA } from './envi-modeler-workflows/spectral-index-isodata';

/**
 * Automated tests for ENVI Modeler validation and workflow creation.
 *
 * Populate this array with test suites. Each suite will generate a spec file
 * in libs/tests/envi-modeler/src/lib/ via the test-tokenizer generator.
 */
export const AUTO_ENVI_MODELER_TESTS: IAutoENVIModelerTest[] = [
  AUTO_ENVI_MODELER_TEST_ADD_AGGREGATORS,
  AUTO_ENVI_MODELER_TEST_BAD_DIRECTION,
  AUTO_ENVI_MODELER_TEST_BAD_EDGES,
  AUTO_ENVI_MODELER_TEST_CHANGE_DETECTION,
  AUTO_ENVI_MODELER_TEST_CHANGE_DETECTION_ML,
  AUTO_ENVI_MODELER_TEST_CORRECT_OUTPUT,
  AUTO_ENVI_MODELER_TEST_DATASET_INDEX,
  AUTO_ENVI_MODELER_TEST_DEEP_LEARNING,
  AUTO_ENVI_MODELER_TEST_IMAGE_CLASSIFICATION_ML,
  AUTO_ENVI_MODELER_TEST_IMAGE_REGISTRATION,
  AUTO_ENVI_MODELER_TEST_ISODATA_WITH_URI,
  AUTO_ENVI_MODELER_TEST_ORTHORECTIFICATION,
  AUTO_ENVI_MODELER_TEST_PARAMS_BAD,
  AUTO_ENVI_MODELER_TEST_SELECTIVE_DOWNSAMPLING,
  AUTO_ENVI_MODELER_TEST_SPECTRAL_INDEX_ISODATA,
];
