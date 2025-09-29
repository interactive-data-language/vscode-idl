import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';

const type = '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15';

console.log('Testing');

const split: string[] = [];
// SplitType(type, split);

const parsed = Parser(type, new CancellationToken(), {
  type: 'types',
  full: false,
});

console.log(parsed.tree);

// const parsed = IDLTypeHelper.parseIDLType(type);

// const serialize = IDLTypeHelper.serializeIDLType(
parsed);

// const parsed2 = IDLTypeHelper.parseIDLType(serialize);

// console.log(StringifyDataForLog('', parsed));
// console.log(StringifyDataForLog('', serialize));
// console.log(StringifyDataForLog('', parsed2));
