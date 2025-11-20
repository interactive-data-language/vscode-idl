import { Assembler } from '@idl/assembler';
import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IParsed } from '@idl/types/syntax-tree';

import {
  ExtractPropertyLines,
  IPropertiesByVarsByLines,
} from './helpers/extract-property-lines';
import { RenameENVITasks } from './helpers/rename-envi-tasks';

/**
 * Converts code to the ENVI Deep Learning 3.0 API
 */
export async function MigrateToDL40(
  parsed: IParsed,
  formatting: IAssemblerOptions<FormatterType>,
  cancel: CancellationToken
) {
  /** Type for our init task */
  const trainType1 = IDLTypeHelper.createTaskType(
    'TrainTensorFlowPixelModel',
    'ENVI'
  );

  /** Type for our init task */
  const trainType2 = IDLTypeHelper.createTaskType(
    'TrainTensorFlowObjectModel',
    'ENVI'
  );

  /** Type for our init task */
  const trainType3 = IDLTypeHelper.createTaskType(
    'TrainTensorFlowGridModel',
    'ENVI'
  );

  console.log(trainType1, trainType2, trainType3);

  /**
   * Track the variable names that we try to migrate properties for
   */
  const initPropertyCheck: { [key: string]: number } = {};

  /**
   * Reverse lookup of where we need to update variables by line
   */
  const trainUpdateLines: { [key: number]: string } = {};

  /**
   * Extract all variables
   */
  const allVars = Object.values(parsed.local.func)
    .concat(Object.values(parsed.local.pro))
    .concat([parsed.local.main]);

  // process all routines
  for (let z = 0; z < allVars.length; z++) {
    /** get variables for our routine */
    const vars = Object.values(allVars[z]);

    /**
     * Process all variables
     */
    for (let i = 0; i < vars.length; i++) {
      console.log(vars[i].meta.type);
      switch (true) {
        /**
         * Check if we have a training task to update
         */
        case IDLTypeHelper.compareTypes(vars[i].meta.type, trainType1):
        case IDLTypeHelper.compareTypes(vars[i].meta.type, trainType2):
        case IDLTypeHelper.compareTypes(vars[i].meta.type, trainType3): {
          initPropertyCheck[vars[i].name] = vars[i].pos[0];
          trainUpdateLines[vars[i].pos[0]] = vars[i].meta.display;
          break;
        }
        /**
         * do nothing
         */
        default:
          break;
      }
    }
  }

  /**
   * Basic serialization of our code
   */

  const asString = Assembler(parsed, cancel, { styleAndFormat: false });
  if (asString === undefined) {
    return;
  }

  /**
   * Get array of strings
   */
  const strings = asString.split(/\r*\n/);

  /**
   * Lookup, by variable, of the property definitions for init tasks
   */
  const propDefLines: IPropertiesByVarsByLines = {};

  console.log(initPropertyCheck);

  /**
   * Check if we have init properties that we want to try and retrieve
   */
  if (Object.keys(initPropertyCheck).length > 0) {
    ExtractPropertyLines(
      parsed.tree,
      strings,
      initPropertyCheck,
      {
        model_name: undefined,
      },
      propDefLines
    );
  }

  // rename tasks
  RenameENVITasks(strings, {
    randomizeparametersfortraintensorflowpixelmodel:
      'RandomizeParametersForTrainDeepLearningPixelModel',
    tensorflowgridclassification: 'DeepLearningGridClassification',
    tensorflowobjectclassification: 'DeepLearningObjectClassification',
    tensorflowoptimizedobjectclassification:
      'DeepLearningOptimizedObjectClassification',
    tensorflowoptimizedpixelclassification:
      'DeepLearningOptimizedPixelClassification',
    tensorflowpixelclassification: 'DeepLearningPixelClassification',
    traintensorflowgridmodel: 'TrainDeepLearningGridModel',
    traintensorflowobjectmodel: 'TrainDeepLearningObjectModel',
    traintensorflowpixelmodel: 'TrainDeepLearningPixelModel',
  });

  /** Get output strings */
  const outStrings: string[] = [];

  /** Get the first set of model init parameters that we have */
  const initParams = Object.values(propDefLines)[0] || {};

  console.log(propDefLines);

  // copy over and add any text
  for (let i = 0; i < strings.length; i++) {
    // save the strings
    outStrings.push(strings[i]);

    // check if we have a training task being initialized and we need
    // to add in missing parameters
    if (i in trainUpdateLines && !('model_name' in initParams)) {
      /** Get the variable name for the line */
      const varName = trainUpdateLines[i];

      // add in code
      outStrings.push('');
      outStrings.push('; ================================================');
      outStrings.push('; TODO: review new/required parameters');
      outStrings.push('; see the documentation for more information');

      /**
       * set model name
       */
      outStrings.push('');
      outStrings.push(
        '; Set name of model (now a required parameter during training instead of optional)'
      );
      outStrings.push(
        `${varName}.${TransformCase(
          'model_name',
          formatting.style.properties
        )} = 'My Awesome Model'`
      );
      outStrings.push('; ================================================');
      outStrings.push('');
    }
  }

  return outStrings.join(formatting?.eol === 'crlf' ? '\r\n' : '\n');
}
