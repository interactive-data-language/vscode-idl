import { IObsolete } from './obsolete.interface';

interface IObsoleteTasks {
  /** Obsolete IDL tasks */
  idl: IObsolete;
  /** Obsolete ENVI tasks */
  envi: IObsolete;
}

/**
 * Obsolete tasks, but ENVI or IDL
 */
export const OBSOLETE_TASKS: IObsoleteTasks = {
  idl: {},
  envi: {
    traintensorflowmaskmodel:
      'Should be replaced with TrainTensorflowPixelModel, see DL 3.0 migration guide',
    tensorflowmaskclassification:
      'Should be replaced with TensorflowPixelClassification, see DL 3.0 migration guide',
  },
};
