import { TestGlobal } from '../helpers/test-global';
import { COLON } from '../tokens/defs/colon.interface';

describe('Validates colon parsing', () => {
  it('verifies we correctly ignore colons where we should', () => {
    const statements = [
      `_IDLitVisualization::SetProperty`,
      `a = _IDLitVisualization::SetProperty()`,
    ];

    // process each number
    for (let i = 0; i < statements.length; i++) {
      expect(TestGlobal(statements[i], COLON.match)).toBeFalsy();
    }
  });
});
