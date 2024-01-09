import { Assembler } from '@idl/assembler';
import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IDLTypeHelper,
  ParseIDLType,
  SerializeIDLType,
} from '@idl/data-types/core';
import {
  BRANCH_TYPES,
  IParsed,
  SyntaxTree,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { AccessPropertyToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';

import { RenameENVITasks } from './helpers/rename-envi-tasks';

/**
 * Renames all references to a properties for given variable names
 */
function CommentOutProperties(
  tree: SyntaxTree,
  variables: { [key: string]: any },
  properties: { [key: string]: any },
  toCommentOut: { [key: string]: any }
) {
  for (let i = 0; i < tree.length; i++) {
    // recurse if needed
    if (tree[i].type === BRANCH_TYPES.BRANCH) {
      CommentOutProperties(
        (tree[i] as TreeBranchToken).kids,
        variables,
        properties,
        toCommentOut
      );
      continue;
    }

    // skip if not variable
    if (tree[i].name !== TOKEN_NAMES.VARIABLE) {
      continue;
    }

    // skip if we have a variable that we cant replace
    if (!(tree[i].match[0].toLowerCase() in variables)) {
      continue;
    }

    // make sure the next token is a property accessor
    if (tree[i + 1]?.name !== TOKEN_NAMES.ACCESS_PROPERTY) {
      continue;
    }

    /** Get the property token */
    const prop = tree[i + 1] as TreeToken<AccessPropertyToken>;

    /** Get the property name */
    const propName = prop.match[0].substring(1).toLowerCase();

    /** Check if we need to update it */
    if (propName in properties) {
      toCommentOut[prop.pos[0]] = undefined;
      // prop.match[0] = `.${toCommentOut[propName]}`;
    }
  }
}

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
   * Check get all variables
   */
  const vars = Object.values(parsed.local.main);

  /**
   * Track the variables that we will reaplce
   */
  const toCommentOut: { [key: number]: undefined } = {};

  /**
   * Track the variable names for training tasks that we need to update
   */
  const trainUpdate: { [key: string]: number } = {};

  /**
   * Reverse lookup of where we need to update variables by line
   */
  const trainUpdateLines: { [key: number]: string } = {};

  /**
   * Process all variables
   */
  for (let i = 0; i < vars.length; i++) {
    switch (true) {
      /**
       * Check if we have an init model var that should be commented out
       */
      case IDLTypeHelper.isType(vars[i].meta.type, initTypeString): {
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

  // update properties if we have them
  if (Object.keys(trainUpdate).length > 0) {
    CommentOutProperties(
      parsed.tree,
      trainUpdate,
      {
        patches_per_epoch: undefined,
        patch_sampling_rate: undefined,
        input_model: undefined,
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

  // rename tasks
  RenameENVITasks(
    strings,
    'TrainTensorFlowMaskModel',
    'TrainTensorFlowPixelModel'
  );
  RenameENVITasks(
    strings,
    'TensorflowMaskClassification',
    'TensorflowPixelClassification'
  );

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

  // copy over and add any text
  for (let i = 0; i < strings.length; i++) {
    outStrings.push(strings[i]);
    if (i in trainUpdateLines) {
      const varName = trainUpdateLines[i];
      outStrings.push('');
      outStrings.push('; TODO: set new parameters');
      outStrings.push(
        `${varName}.${TransformCase(
          'model_architecture',
          formatting.style.properties
        )} = 'SegUNet++'`
      );
      outStrings.push('');
    }
  }

  return outStrings.join(formatting?.eol === 'crlf' ? '\r\n' : '\n');
}
