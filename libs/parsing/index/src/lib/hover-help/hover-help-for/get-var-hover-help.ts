import { IDLTypeHelper } from '@idl/data-types/core';
import {
  ILocalTokenLookup,
  IParentInformation,
  IParsed,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/parsing/tokenizer';

/**
 * Returns hover help for variables
 *
 * TODO: Use our GetVariableSource helper instead of duplicate
 * logic
 */
export function GetVarHoverHelp(
  parsed: IParsed,
  token: TreeToken<TokenName>,
  parent?: IParentInformation
): string {
  let help = '';

  // return if we dont actually have a parent
  if (parent === undefined) {
    return help;
  }

  // check for parent
  if (parent !== undefined) {
    const varName = token.match[0].toLowerCase();
    const parentName = parent.name;

    // init variable lookup
    let lookup: ILocalTokenLookup = {};

    // extract lookup
    switch (parent.type) {
      case 'function':
        if (parentName in parsed.local.func) {
          lookup = parsed.local.func[parentName];
        }
        break;
      case 'procedure':
        if (parentName in parsed.local.pro) {
          lookup = parsed.local.pro[parentName];
        }
        break;
      case 'main':
        lookup = parsed.local.main;
        break;
      default:
        // DO NOTHING
        break;
    }

    // check for matching variable and set docs
    if (varName in lookup) {
      const meta = lookup[varName].meta;

      help = IDLTypeHelper.addTypeToDocs(token.match[0], meta.docs, meta.type);
    }
  }

  return help;
}
