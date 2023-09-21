import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Use variable before it is defined`, () => {
  it(`[auto generated] does not trigger anywhere`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      `function ReadExif::_GetName, tag, image = img, photo = pht, gps = gps, iop = iop`,
      `compile_opt idl2, hidden`,
      ``,
      `name = ''`,
      `img = keyword_set(img)`,
      `pht = keyword_set(pht)`,
      `gps = keyword_set(gps)`,
      `iop = keyword_set(iop)`,
      ``,
      `; if none are set, default to all`,
      `if (array_equal([img, pht, gps, iop], 0)) then begin`,
      `  img = (pht = (gps = (iop = 1)))`,
      `endif`,
      ``,
      `if (iop) then begin`,
      `  if (self.ioptags.HasKey(tag)) then begin`,
      `    name = self.ioptags[tag]`,
      `  endif`,
      `endif`,
      ``,
      `if (gps) then begin`,
      `  if (self.gpstags.HasKey(tag)) then begin`,
      `    name = self.gpstags[tag]`,
      `  endif`,
      `endif`,
      ``,
      `if (pht) then begin`,
      `  if (self.phototags.HasKey(tag)) then begin`,
      `    name = self.phototags[tag]`,
      `  endif`,
      `endif`,
      ``,
      `if (img) then begin`,
      `  if (self.imagetags.HasKey(tag)) then begin`,
      `    name = self.imagetags[tag]`,
      `  endif`,
      `endif`,
      ``,
      `return, name`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
