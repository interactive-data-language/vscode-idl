import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we style if-then`, () => {
  it(`[auto generated] complex scenarios for if-then-else`, async () => {
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
      `  COMPILE_OPT idl2`,
      ``,
      `  IF (n_elements(useDicomexIn) EQ 1) THEN $`,
      `    useDicomex = keyword_set(useDicomexIn) $`,
      `  ELSE $`,
      `    useDicomex = 1`,
      ``,
      `  if !true then print, 'true' else print, 'false'`,
      ``,
      `  IF (n_elements(useDicomexIn) EQ 1) $`,
      `THEN $`,
      `  useDicomex = keyword_set(useDicomexIn) $`,
      `   ELSE $`,
      `  useDicomex = 1`,
      ``,
      `  if !true then begin`,
      `print, 'no'`,
      `  endif else begin`,
      `        b = 42`,
      `  endelse`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `if (n_elements(useDicomexIn) eq 1) then $`,
        `  useDicomex = keyword_set(useDicomexIn) $`,
        `else $`,
        `  useDicomex = 1`,
        ``,
        `if !true then print, 'true' else print, 'false'`,
        ``,
        `if (n_elements(useDicomexIn) eq 1) $`,
        `  then $`,
        `    useDicomex = keyword_set(useDicomexIn) $`,
        `  else $`,
        `    useDicomex = 1`,
        ``,
        `if !true then begin`,
        `  print, 'no'`,
        `endif else begin`,
        `  b = 42`,
        `endelse`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [18, 8, 1],
        end: [18, 8, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] keep on indenting with line continuations`, async () => {
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
      `compile_opt idl2`,
      `; when in paren, not as pretty`,
      `if (!true $`,
      ` ) then $`,
      `imageFFT = FFT(image, -1)`,
      ``,
      `;;outside of paren, looks much nicer as long as enclosed`,
      `if (!true)$`,
      ` then $`,
      `imageFFT = FFT(image, -1)`,
      ``,
      `a = 5`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `; when in paren, not as pretty`,
        `if (!true $`,
        `  ) then $`,
        `  imageFFT = fft(image, -1)`,
        ``,
        `; ;outside of paren, looks much nicer as long as enclosed`,
        `if (!true) $`,
        `  then $`,
        `    imageFFT = fft(image, -1)`,
        ``,
        `a = 5`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [11, 0, 1],
        end: [11, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] complex indentation for if statement`, async () => {
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
      `compile_opt idl2`,
      `if ((imageSz.N_DIMENSIONS ne 2) || $`,
      `((imageSz.TYPE ne 6) && (imageSz.TYPE ne 9)) || $`,
      `  MAX(imageSz.DIMENSIONS[0 : 1] ne imageDims[0] * 2)) then begin`,
      `    ; Double the image size and pad with zeros`,
      `    bigImage = dblarr(imageDims[0] * 2, imageDims[1] * 2)`,
      `    bigImage[0 : imageDims[0] - 1, 0 : imageDims[1] - 1] = image`,
      `    imageFFT = FFT(bigImage, -1)`,
      `    imageNElts = N_ELEMENTS(bigImage)`,
      `  endif`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `if ((imageSz.n_dimensions ne 2) || $`,
        `  ((imageSz.type ne 6) && (imageSz.type ne 9)) || $`,
        `  max(imageSz.dimensions[0 : 1] ne imageDims[0] * 2)) then begin`,
        `  ; Double the image size and pad with zeros`,
        `  bigImage = dblarr(imageDims[0] * 2, imageDims[1] * 2)`,
        `  bigImage[0 : imageDims[0] - 1, 0 : imageDims[1] - 1] = image`,
        `  imageFFT = fft(bigImage, -1)`,
        `  imageNElts = n_elements(bigImage)`,
        `endif`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 99,
        info: 'Undefined variable "imageSz"',
        start: [1, 5, 7],
        end: [1, 5, 7],
      },
      {
        code: 99,
        info: 'Undefined variable "imageSz"',
        start: [2, 2, 7],
        end: [2, 2, 7],
      },
      {
        code: 99,
        info: 'Undefined variable "imageSz"',
        start: [2, 25, 7],
        end: [2, 25, 7],
      },
      {
        code: 99,
        info: 'Undefined variable "imageSz"',
        start: [3, 6, 7],
        end: [3, 6, 7],
      },
      {
        code: 99,
        info: 'Undefined variable "imageDims"',
        start: [3, 35, 9],
        end: [3, 35, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "imageDims"',
        start: [5, 22, 9],
        end: [5, 22, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "imageDims"',
        start: [5, 40, 9],
        end: [5, 40, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "imageDims"',
        start: [6, 17, 9],
        end: [6, 17, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "imageDims"',
        start: [6, 39, 9],
        end: [6, 39, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "image"',
        start: [6, 59, 5],
        end: [6, 59, 5],
      },
      {
        code: 104,
        info: 'Unused variable "imageFFT"',
        start: [7, 4, 8],
        end: [7, 4, 8],
      },
      {
        code: 104,
        info: 'Unused variable "imageNElts"',
        start: [8, 4, 10],
        end: [8, 4, 10],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] very complex if statement for regression test`, async () => {
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
      `compile_opt idl2`,
      ``,
      `  ;; Check to see if texture map was passed in as 3 or 4 separate 2D`,
      `  ;; arrays.  textureRed, textureGreen, and textureBlue must all`,
      `  ;; be 2D arrays of the same size and type and textureImage must`,
      `  ;; not be set.`,
      `  IF keyword_set(textureRed) && keyword_set(textureGreen) && $`,
      `    keyword_set(textureBlue) && ~keyword_set(textureImage) && $`,
      `    (size(reform(textureRed),/n_dimensions) EQ 2) && $`,
      `    (size(reform(textureGreen),/n_dimensions) EQ 2) && $`,
      `    (size(reform(textureBlue),/n_dimensions) EQ 2) && $`,
      `    ( ((textmap_x=(size(reform(textureRed),/dimensions))[0])) EQ $`,
      `      (size(reform(textureGreen),/dimensions))[0] ) && $`,
      `    ( textmap_x EQ (size(reform(textureBlue),/dimensions))[0] ) && $`,
      `    ( ((textmap_y=(size(reform(textureRed),/dimensions))[1])) EQ $`,
      `      (size(reform(textureGreen),/dimensions))[1] ) && $`,
      `    ( textmap_y EQ (size(reform(textureBlue),/dimensions))[1] ) && $`,
      `    ( ((textmap_type=(size(reform(textureRed),/type))[0])) EQ $`,
      `      (size(reform(textureGreen),/type))[0] ) && $`,
      `    ( textmap_type EQ (size(reform(textureBlue),/type))[0] ) && $`,
      `    ( where(textmap_type EQ [0l,6,7,8,9,10,11]) EQ -1 ) THEN BEGIN`,
      `    ;; textureAlpha, if set, must match TEXTURE_* in size and type`,
      `    IF keyword_set(textureAlpha) && $`,
      `      (size(reform(textureAlpha),/n_dimensions) EQ 2) && $`,
      `      ( textmap_x EQ (size(reform(textureAlpha),/dimensions))[0]) && $`,
      `      ( textmap_y EQ (size(reform(textureAlpha),/dimensions))[1]) && $`,
      `      ( textmap_type EQ (size(reform(textureAlpha),/type))[0]) $`,
      `      THEN BEGIN`,
      `      textData = make_array(4,textmap_x,textmap_y,type=textmap_type)`,
      `      textData[0,*,*] = textureRed`,
      `      textData[1,*,*] = textureGreen`,
      `      textData[2,*,*] = textureBlue`,
      `      textData[3,*,*] = textureAlpha`,
      `    ENDIF ELSE BEGIN`,
      `      textData = make_array(3,textmap_x,textmap_y,type=textmap_type)`,
      `      textData[0,*,*] = textureRed`,
      `      textData[1,*,*] = textureGreen`,
      `      textData[2,*,*] = textureBlue`,
      `    ENDELSE`,
      `    oTextMap = obj_new('idlitDataIDLArray3d', textData, $`,
      `                       NAME='TEXTURE')`,
      `    oParmSet->add, oTextMap, PARAMETER_NAME= "TEXTURE"`,
      `  ENDIF`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `; ; Check to see if texture map was passed in as 3 or 4 separate 2D`,
        `; ; arrays.  textureRed, textureGreen, and textureBlue must all`,
        `; ; be 2D arrays of the same size and type and textureImage must`,
        `; ; not be set.`,
        `if keyword_set(textureRed) && keyword_set(textureGreen) && $`,
        `  keyword_set(textureBlue) && ~keyword_set(textureImage) && $`,
        `  (size(reform(textureRed), /n_dimensions) eq 2) && $`,
        `  (size(reform(textureGreen), /n_dimensions) eq 2) && $`,
        `  (size(reform(textureBlue), /n_dimensions) eq 2) && $`,
        `  (((textmap_x = (size(reform(textureRed), /dimensions))[0])) eq $`,
        `    (size(reform(textureGreen), /dimensions))[0]) && $`,
        `  (textmap_x eq (size(reform(textureBlue), /dimensions))[0]) && $`,
        `  (((textmap_y = (size(reform(textureRed), /dimensions))[1])) eq $`,
        `    (size(reform(textureGreen), /dimensions))[1]) && $`,
        `  (textmap_y eq (size(reform(textureBlue), /dimensions))[1]) && $`,
        `  (((textmap_type = (size(reform(textureRed), /type))[0])) eq $`,
        `    (size(reform(textureGreen), /type))[0]) && $`,
        `  (textmap_type eq (size(reform(textureBlue), /type))[0]) && $`,
        `  (where(textmap_type eq [0l, 6, 7, 8, 9, 10, 11]) eq -1) then begin`,
        `  ; ; textureAlpha, if set, must match TEXTURE_* in size and type`,
        `  if keyword_set(textureAlpha) && $`,
        `    (size(reform(textureAlpha), /n_dimensions) eq 2) && $`,
        `    (textmap_x eq (size(reform(textureAlpha), /dimensions))[0]) && $`,
        `    (textmap_y eq (size(reform(textureAlpha), /dimensions))[1]) && $`,
        `    (textmap_type eq (size(reform(textureAlpha), /type))[0]) $`,
        `  then begin`,
        `    textData = make_array(4, textmap_x, textmap_y, type = textmap_type)`,
        `    textData[0, *, *] = textureRed`,
        `    textData[1, *, *] = textureGreen`,
        `    textData[2, *, *] = textureBlue`,
        `    textData[3, *, *] = textureAlpha`,
        `  endif else begin`,
        `    textData = make_array(3, textmap_x, textmap_y, type = textmap_type)`,
        `    textData[0, *, *] = textureRed`,
        `    textData[1, *, *] = textureGreen`,
        `    textData[2, *, *] = textureBlue`,
        `  endelse`,
        `  oTextMap = obj_new('idlitDataIDLArray3d', textData, $`,
        `    name = 'TEXTURE')`,
        `  oParmSet.add, oTextMap, parameter_name = 'TEXTURE'`,
        `endif`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [6, 17, 10],
        end: [6, 17, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [6, 44, 12],
        end: [6, 44, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [7, 16, 11],
        end: [7, 16, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "textureImage"',
        start: [7, 45, 12],
        end: [7, 45, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [8, 17, 10],
        end: [8, 17, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [9, 17, 12],
        end: [9, 17, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [10, 17, 11],
        end: [10, 17, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [11, 31, 10],
        end: [11, 31, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [12, 19, 12],
        end: [12, 19, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [13, 32, 11],
        end: [13, 32, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [14, 31, 10],
        end: [14, 31, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [15, 19, 12],
        end: [15, 19, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [16, 32, 11],
        end: [16, 32, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [17, 34, 10],
        end: [17, 34, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [18, 19, 12],
        end: [18, 19, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [19, 35, 11],
        end: [19, 35, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "textureAlpha"',
        start: [22, 19, 12],
        end: [22, 19, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureAlpha"',
        start: [23, 19, 12],
        end: [23, 19, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureAlpha"',
        start: [24, 34, 12],
        end: [24, 34, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureAlpha"',
        start: [25, 34, 12],
        end: [25, 34, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureAlpha"',
        start: [26, 37, 12],
        end: [26, 37, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [29, 24, 10],
        end: [29, 24, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [30, 24, 12],
        end: [30, 24, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [31, 24, 11],
        end: [31, 24, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "textureAlpha"',
        start: [32, 24, 12],
        end: [32, 24, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureRed"',
        start: [35, 24, 10],
        end: [35, 24, 10],
      },
      {
        code: 99,
        info: 'Undefined variable "textureGreen"',
        start: [36, 24, 12],
        end: [36, 24, 12],
      },
      {
        code: 99,
        info: 'Undefined variable "textureBlue"',
        start: [37, 24, 11],
        end: [37, 24, 11],
      },
      {
        code: 99,
        info: 'Undefined variable "oParmSet"',
        start: [41, 4, 8],
        end: [41, 4, 8],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
