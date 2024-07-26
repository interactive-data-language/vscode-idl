import { NAME_TEST } from '../tokens/defs/names.interface';

describe('Validates name/variables being valid', () => {
  it('test check', () => {
    expect(NAME_TEST.test(`right`)).toBeTruthy();
    expect(NAME_TEST.test(`_goo7$`)).toBeTruthy();

    expect(NAME_TEST.test(`0wrong`)).toBeFalsy();
    expect(NAME_TEST.test(`$wrong`)).toBeFalsy();
  });
});
