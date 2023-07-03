import { IDL_PROBLEM_CODES } from './idl-problem-codes.interface';

describe('Validates PROBLEM_LOOKUP', () => {
  it('to make sure unique tokens', () => {
    // get information from our token lookup
    const keys = Object.keys(IDL_PROBLEM_CODES);
    const values = Object.values(IDL_PROBLEM_CODES);

    // process all keys
    for (let i = 0; i < keys.length; i++) {
      const value = IDL_PROBLEM_CODES[keys[i]];

      // find number of matches
      let count = 0;
      for (let j = 0; j < values.length; j++) {
        if (value === values[j]) {
          count += 1;
        }
      }

      // make sure we only have one match
      expect(count).toEqual(1);
    }
  });
});
