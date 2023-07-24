import { IDL_TRANSLATION } from '@idl/translation';
import copy from 'fast-copy';

import { IDL } from '../idl.class';
import { DEFAULT_IDL_INFO, IDLInfo } from '../idl.interface';
import { CleanIDLOutput } from './clean-idl-output';

/**
 * Processes scope information from IDL
 */
export function ProcessScope(idl: IDL, output: string) {
  // verify we found what we were looking for
  if (output.indexOf('{"scope"') === -1) {
    return copy(DEFAULT_IDL_INFO);
  }

  // get the part of the string for parsing
  const toParse = CleanIDLOutput(output);

  // lets try to parse everything
  try {
    // const split = output.split('\n');
    // const parse = split[split.length - 2];
    const info: IDLInfo = JSON.parse(toParse);

    // say that we have info
    info.hasInfo = true;

    // check if we have main and no file and remove our last item because we cant
    // jump to it and vscode doesnt appreciate that
    const lastItem = info.scope[info.scope.length - 1];
    if (
      lastItem.routine === '$main$' &&
      lastItem.file === '' &&
      lastItem.line === 0
    ) {
      info.scope.pop();
    }

    // return
    return info;
  } catch (err) {
    idl.log.log({
      content: [
        'Error parsing output',
        JSON.stringify(output),
        JSON.stringify(toParse),
      ],
      type: 'error',
      alert: IDL_TRANSLATION.debugger.adapter.scopeParseError,
    });
    return copy(DEFAULT_IDL_INFO);
  }
}
