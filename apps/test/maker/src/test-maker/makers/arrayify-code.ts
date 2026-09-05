/**
 * For automated tests, converts code to an array of strings and normalized cleanup for
 * consistency across auto-test frameworks
 */
export function ArrayifyCode(code: string | string[]): string[] {
  // get the code to print
  const asArray = Array.isArray(code) ? code : code.split(`\n`);

  // clean up strings and remove tab characters
  for (let j = 0; j < asArray.length; j++) {
    asArray[j] = asArray[j].replace(/\t/, '  ');
  }

  // // filter empty strings
  // const remove: number[] = [];
  // for (let j = 0; j < asArray.length; j++) {
  //   if (!asArray[j]) {
  //     remove.push(j);
  //   } else {
  //     break;
  //   }
  // }

  // // delete the empty strings
  // const reversed = remove.reverse();
  // for (let j = 0; j < reversed.length; j++) {
  //   asArray.splice(reversed[j], 1);
  // }

  return asArray;
}
