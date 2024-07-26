import { TestGlobal } from '../helpers/test-global';
import { LOOP_SECONDARY, LOOP_START } from '../tokens/defs/loops.interface';

describe('Validates basic loop parsing terms', () => {
  it('correctly identifies start terms', () => {
    const match = [`for`, `for i=`, `foreach`, `while`, `repeat`];
    for (let i = 0; i < match.length; i++) {
      expect(TestGlobal(match[i], LOOP_START.match)).toBeTruthy();
    }
  });

  it('correctly identifies start terms', () => {
    const match = [`do`, `until`];
    for (let i = 0; i < match.length; i++) {
      expect(TestGlobal(match[i], LOOP_SECONDARY.match)).toBeTruthy();
    }
  });

  it('correctly ignores confusing statements with start', () => {
    const confusers = [`fory`, `befor`, `befforeach`, `allthewhile`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], LOOP_START.match)).toBeFalsy();
    }
  });

  it('correctly ignores confusing statements', () => {
    const confusers = [
      `dont`,
      `dodo`,
      `done`,
      `untils`,
      `luntils`,
      `repeating`,
      `repeated`,
      `untils`,
      `luntils`,
    ];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], LOOP_START.match)).toBeFalsy();
      expect(TestGlobal(confusers[i], LOOP_SECONDARY.match)).toBeFalsy();
    }
  });
});
