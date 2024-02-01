import { Assembler } from '@idl/assembler';
import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/parsing/syntax-tree';
import { IDLTypeHelper, ParseIDLType, SerializeIDLType } from '@idl/types/core';

import {
  ExtractPropertyLines,
  IPropertiesByVarsByLines,
} from './helpers/extract-property-lines';
import { FindProperties } from './helpers/find-properties';
import { RenameENVITasks } from './helpers/rename-envi-tasks';

/**
 * Converts code to the ENVI Deep Learning 3.0 API
 */
export async function MigrateToDL30(
  parsed: IParsed,
  formatting: IAssemblerOptions<FormatterType>,
  cancel: CancellationToken
) {
  /** Type for our init task */
  const initType = ParseIDLType('ENVITask<InitializeENVINet5MultiModel>');

  /** Convert to string */
  const initTypeString = SerializeIDLType(initType, true);

  /** Type for our init task */
  const trainType = ParseIDLType('ENVITask<TrainTensorFlowMaskModel>');

  /** Convert to string */
  const trainTypeString = SerializeIDLType(trainType, true);

  /**
   * Track the lines that we will comment out
   */
  const toCommentOut: { [key: number]: undefined } = {};

  /**
   * Track the variable names that we try to migrate properties for
   */
  const initPropertyCheck: { [key: string]: number } = {};

  /**
   * Track the variable names for training tasks that we need to update
   */
  const trainUpdate: { [key: string]: number } = {};

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
      switch (true) {
        /**
         * Check if we have an init model var that should be commented out
         */
        case IDLTypeHelper.isType(vars[i].meta.type, initTypeString): {
          initPropertyCheck[vars[i].name] = vars[i].pos[0];
          const positions = vars[i].meta.usage;
          for (let j = 0; j < positions.length; j++) {
            toCommentOut[positions[j][0]] = undefined;
          }
          break;
        }
        /**
         * Check if we have a training task to update
         */
        case IDLTypeHelper.isType(vars[i].meta.type, trainTypeString): {
          trainUpdate[vars[i].name] = vars[i].pos[0];
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

  // update properties if we have them
  if (Object.keys(trainUpdate).length > 0) {
    FindProperties(
      parsed.tree,
      trainUpdate,
      {
        patches_per_epoch: undefined,
        patch_sampling_rate: undefined,
        input_model: undefined,
        validation_f1: undefined,
        validation_loss: undefined,
        validation_precision: undefined,
        validation_recall: undefined,
      },
      toCommentOut
    );
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

  /**
   * Check if we have init properties that we want to try and retrieve
   */
  if (Object.keys(initPropertyCheck).length > 0) {
    ExtractPropertyLines(
      parsed.tree,
      strings,
      initPropertyCheck,
      {
        model_architecture: undefined,
        patch_size: undefined,
      },
      propDefLines
    );
  }

  // rename tasks
  RenameENVITasks(strings, {
    traintensorflowmaskmodel: 'TrainTensorFlowPixelModel',
    tensorflowmaskclassification: 'TensorflowPixelClassification',
  });

  /**
   * get lines that we need to remove
   */
  const lines = Object.keys(toCommentOut).map((i) => +i);

  // comment out the lines
  for (let i = 0; i < lines.length; i++) {
    strings[lines[i]] = `; ${strings[lines[i]]}`;
  }

  /** Get output strings */
  const outStrings: string[] = [];

  /** Get the first set of model init parameters that we have */
  const initParams = Object.values(propDefLines)[0] || {};

  // copy over and add any text
  for (let i = 0; i < strings.length; i++) {
    // skip if a line that we dont need anymore
    if (i in toCommentOut) {
      continue;
    }

    // save the strings
    outStrings.push(strings[i]);

    // check if we have a training task being initialized and we need
    // to add in missing parameters
    if (i in trainUpdateLines) {
      /** Get the variable name for the line */
      const varName = trainUpdateLines[i];

      // add in code
      outStrings.push('');
      outStrings.push('; ================================================');
      outStrings.push('; TODO: review new parameters');
      outStrings.push(
        '; see the migration guide in the help for more information'
      );
      outStrings.push('');

      /**
       * set model architecture and check if we have info
       * from above
       */
      outStrings.push('; the type of model that we use');
      let addedArch = false;
      if ('model_architecture' in initParams) {
        outStrings.push(`${varName}${initParams['model_architecture'][0][1]}`);
        addedArch = true;
      }
      if (!addedArch) {
        outStrings.push(
          `${varName}.${TransformCase(
            'model_architecture',
            formatting.style.properties
          )} = 'SegUNet++'`
        );
      }
      outStrings.push('');

      /**
       * set patch size and check if we have info
       * from above
       */
      outStrings.push('; the patch size (how much data we see at once)');
      let addedPatch = false;
      if ('patch_size' in initParams) {
        outStrings.push(`${varName}${initParams['patch_size'][0][1]}`);
        addedPatch = true;
      }
      if (!addedPatch) {
        outStrings.push(
          `${varName}.${TransformCase(
            'patch_size',
            formatting.style.properties
          )} = 464`
        );
      }
      outStrings.push('');
      outStrings.push(
        '; train on X% of our examples within the training rasters'
      );
      outStrings.push(
        `${varName}.${TransformCase(
          'feature_patch_percentage',
          formatting.style.properties
        )} = 1.0 ; 1.0 = 100%`
      );
      outStrings.push('');
      outStrings.push('; for every 100 examples of features,');
      outStrings.push(
        '; how many examples of the background get added during training?'
      );
      outStrings.push(
        `${varName}.${TransformCase(
          'background_patch_ratio',
          formatting.style.properties
        )} = 0.2 ; 0.2 = 20%`
      );
      outStrings.push('; ================================================');
      outStrings.push('');
    }
  }

  return outStrings.join(formatting?.eol === 'crlf' ? '\r\n' : '\n');
}
