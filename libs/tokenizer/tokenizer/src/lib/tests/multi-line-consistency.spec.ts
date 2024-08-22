import { CancellationToken } from '@idl/cancellation-tokens';

import { StripIDs } from '../helpers/strip-ids';
import { Tokenizer } from '../tokenizer';

describe('Validates processing the same line multiple times', () => {
  it('gives the same result', () => {
    const code = [
      `oVis[iOk[i]]->_IDLitVisualization::SetProperty, GROUP_PARENT=obj_new()`,
      `oVis[iOk[i]]->_IDLitVisualization::SetProperty, GROUP_PARENT=obj_new()`,
    ];

    // get our tokens
    const tokens = Tokenizer(code, new CancellationToken()).tokens;

    // extract line-specific tokens
    const line1 = tokens.filter((t) => t.pos[0] === 0);
    const line2 = tokens.filter((t) => t.pos[0] === 1);

    // make sure we have the same number of tokens
    expect(line1.length).toBe(line2.length);

    // make the lines for line 2 all the same
    for (let i = 0; i < line2.length; i++) {
      line2[i].pos[0] = 0;
    }

    // make sure they are equal
    expect(StripIDs(line1, true)).toEqual(StripIDs(line2, true));
  });
});
