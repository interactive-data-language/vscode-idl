import { StringifyDataForLog } from '@idl/logger';
import { IDLTypeHelper } from '@idl/parsing/type-parser';

const type = '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15';
// const type = 'ENVITask<FOOBERRy, Junior> | "5" | 6.0';

const parsed = IDLTypeHelper.parseIDLType(type);

console.log(StringifyDataForLog('', parsed));
console.log(IDLTypeHelper.serializeIDLType(parsed));

// const parsed2 = IDLTypeHelper.parseIDLType(serialize);

// console.log(StringifyDataForLog('', parsed));
// console.log(StringifyDataForLog('', serialize));
// console.log(StringifyDataForLog('', parsed2));
