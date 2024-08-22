import { TOKEN_NAMES } from './tokens.interface';

describe('Validates TOKEN_LOOKUP', () => {
  it('to make sure unique tokens', () => {
    // get information from our token lookup
    const keys = Object.keys(TOKEN_NAMES);
    const values = Object.values(TOKEN_NAMES);

    // process all keys
    for (let i = 0; i < keys.length; i++) {
      const value = TOKEN_NAMES[keys[i]];

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
