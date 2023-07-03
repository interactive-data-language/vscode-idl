import { TestGlobal } from '../helpers/test-global';
import { BLOCK, BLOCK_CLOSE_VALIDATOR } from '../tokens/defs/block.interface';

describe('Validates basic block parsing terms', () => {
  it('correctly identifies start terms', () => {
    const match = [`begin`, `BEGIN`];
    for (let i = 0; i < match.length; i++) {
      expect(TestGlobal(match[i], BLOCK.match)).toBeTruthy();
    }
  });

  it('correctly ignores confusing statements with start', () => {
    const confusers = [`beginning`, `notbegin`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], BLOCK.match)).toBeFalsy();
    }
  });

  it('correctly identifies end terms', () => {
    const match = [
      `end`,
      `endif`,
      `endelse`,
      `endfor`,
      `endforeach`,
      `endrep`,
      `endwhile`,
      `endswitch`,
      `endcase`,
    ];
    for (let i = 0; i < match.length; i++) {
      expect(TestGlobal(match[i], BLOCK.end)).toBeTruthy();
      expect(TestGlobal(match[i], BLOCK_CLOSE_VALIDATOR)).toBeTruthy();
    }
  });

  it('correctly ignores confusing statements with end', () => {
    const confusers = [`bend`, `rend`, `behend`];
    for (let i = 0; i < confusers.length; i++) {
      expect(TestGlobal(confusers[i], BLOCK.end)).toBeFalsy();
      expect(TestGlobal(confusers[i], BLOCK_CLOSE_VALIDATOR)).toBeFalsy();
    }
  });

  it('correctly invalidates end statements', () => {
    const invalid = [`ended`, `ending`, `ender`];
    for (let i = 0; i < invalid.length; i++) {
      expect(TestGlobal(invalid[i], BLOCK_CLOSE_VALIDATOR)).toBeFalsy();
    }
  });
});
