import { TestGlobal } from '../helpers/test-global';
import {
  LOGICAL_CASE_SWITCH,
  LOGICAL_IF,
  LOGICAL_OF,
  LOGICAL_THEN_ELSE,
} from '../tokens/defs/logical.interface';

describe('Validates logic statement parsing terms', () => {
  it('correctly ignores confusing statements', () => {
    const confusers = [`bif`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], LOGICAL_IF.match)).toBeFalsy();
    }
  });

  it('correctly ignores confusing statements', () => {
    const confusers = [`thenny`, `kelse`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], LOGICAL_THEN_ELSE.match)).toBeFalsy();
    }
  });

  it('correctly ignores confusing statements', () => {
    const confusers = [`caser`, `flipswitch`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], LOGICAL_CASE_SWITCH.match)).toBeFalsy();
    }
  });

  it('correctly ignores confusing statements', () => {
    const confusers = [`lofe`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], LOGICAL_OF.match)).toBeFalsy();
    }
  });
});
