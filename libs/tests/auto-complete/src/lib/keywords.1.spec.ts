import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provides auto complete for keywords`, () => {
  it(`[auto generated] things after brackets and parentheses`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/auto-complete/keywords.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 4, character: 10 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'center = ',
        insertText: '/center',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to shift the zero-frequency component to the center of the spectrum. In the forward direction, when CENTER is set, the resulting Fourier transform has the zero-frequency component shifted to the center of the array. In the reverse direction, when CENTER is set, the input is assumed to be a centered Fourier transform, and the coefficients are shifted back before performing the inverse transform.\n\n**Note:** For an odd number of points the zero-frequency component will be in the center. For an even number of points the first element will correspond to the Nyquist frequency component, followed by the remaining frequency components - the zero-frequency component will then be in the center of the remaining components.',
        },
      },
      {
        label: 'dimension = ',
        insertText: 'dimension = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a scalar indicating the dimension across which to calculate the FFT. If this keyword is not present or is zero, then the FFT is computed across all dimensions of the input array. If this keyword is present, then the FFT is only calculated only across a single dimension. For example, if the dimensions of Array are N1, N2, N3, and DIMENSION is 2, the FFT is calculated only across the second dimension.\n\n**Note:** If the CENTER keyword is also set, then only the dimension given by the DIMENSION keyword is shifted to the center. The other dimensions remain unshifted.',
        },
      },
      {
        label: 'double = ',
        insertText: 'double = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a value other than zero to force the computation to be done in double-precision arithmetic, and to give a result of double-precision complex type. If DOUBLE is set equal to zero, computation is done in single-precision arithmetic and the result is single-precision complex. If DOUBLE is not specified, the data type of the result will match the data type of _Array_.',
        },
      },
      {
        label: 'inverse = ',
        insertText: '/inverse',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to perform an inverse transform. Setting this keyword is equivalent to setting the _Direction_ argument to a positive value. Note, however, that setting INVERSE results in an inverse transform even if _Direction_ is specified as negative.',
        },
      },
      {
        label: 'overwrite = ',
        insertText: '/overwrite',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'If this keyword is set, and the _Array_ parameter is a variable of complex type, the transform is done “in-place”. The result overwrites the previous contents of the variable. \n\nFor example, to perform a forward, in-place FFT on the variable a:\n\n```idl\n  a = fft(a, -1, /overwrite)\n```',
        },
      },
      {
        label: 'tpool_max_elts = ',
        insertText: 'tpool_max_elts = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a non-zero value to set the maximum number of data elements involved in a computation that uses the thread pool. If the number of elements in the computation exceeds the number you specify, IDL will not use the thread pool for the computation. Setting this value to 0 removes any limit on the maximum number of elements, and any computation with at least TPOOL_MIN_ELTS will use the thread pool.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_MAX_ELTS.',
        },
      },
      {
        label: 'tpool_min_elts = ',
        insertText: 'tpool_min_elts = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a non-zero value to set the minimum number of data elements involved in a computation that uses the thread pool. If the number of elements in the computation is less than the number you specify, IDL will not use the thread pool for the computation. Use this keyword to prevent IDL from using the thread pool on tasks that are too small to benefit from it.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_MIN_ELTS.',
        },
      },
      {
        label: 'tpool_nothread = ',
        insertText: '/tpool_nothread',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to explicitly prevent IDL from using the thread pool for the current computation. If this keyword is set, IDL will use the non-threaded implementation of the routine even if the current settings of the !CPU system variable would allow use of the threaded implementation.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_NTHREADS.',
        },
      },
      {
        label: 'a',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'b',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'p',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'e',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'var',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
    // define position
    const position_1: Position = { line: 7, character: 11 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'center = ',
        insertText: 'center',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to shift the zero-frequency component to the center of the spectrum. In the forward direction, when CENTER is set, the resulting Fourier transform has the zero-frequency component shifted to the center of the array. In the reverse direction, when CENTER is set, the input is assumed to be a centered Fourier transform, and the coefficients are shifted back before performing the inverse transform.\n\n**Note:** For an odd number of points the zero-frequency component will be in the center. For an even number of points the first element will correspond to the Nyquist frequency component, followed by the remaining frequency components - the zero-frequency component will then be in the center of the remaining components.',
        },
      },
      {
        label: 'dimension = ',
        insertText: 'dimension',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a scalar indicating the dimension across which to calculate the FFT. If this keyword is not present or is zero, then the FFT is computed across all dimensions of the input array. If this keyword is present, then the FFT is only calculated only across a single dimension. For example, if the dimensions of Array are N1, N2, N3, and DIMENSION is 2, the FFT is calculated only across the second dimension.\n\n**Note:** If the CENTER keyword is also set, then only the dimension given by the DIMENSION keyword is shifted to the center. The other dimensions remain unshifted.',
        },
      },
      {
        label: 'double = ',
        insertText: 'double',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a value other than zero to force the computation to be done in double-precision arithmetic, and to give a result of double-precision complex type. If DOUBLE is set equal to zero, computation is done in single-precision arithmetic and the result is single-precision complex. If DOUBLE is not specified, the data type of the result will match the data type of _Array_.',
        },
      },
      {
        label: 'inverse = ',
        insertText: 'inverse',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to perform an inverse transform. Setting this keyword is equivalent to setting the _Direction_ argument to a positive value. Note, however, that setting INVERSE results in an inverse transform even if _Direction_ is specified as negative.',
        },
      },
      {
        label: 'overwrite = ',
        insertText: 'overwrite',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'If this keyword is set, and the _Array_ parameter is a variable of complex type, the transform is done “in-place”. The result overwrites the previous contents of the variable. \n\nFor example, to perform a forward, in-place FFT on the variable a:\n\n```idl\n  a = fft(a, -1, /overwrite)\n```',
        },
      },
      {
        label: 'tpool_max_elts = ',
        insertText: 'tpool_max_elts',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a non-zero value to set the maximum number of data elements involved in a computation that uses the thread pool. If the number of elements in the computation exceeds the number you specify, IDL will not use the thread pool for the computation. Setting this value to 0 removes any limit on the maximum number of elements, and any computation with at least TPOOL_MIN_ELTS will use the thread pool.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_MAX_ELTS.',
        },
      },
      {
        label: 'tpool_min_elts = ',
        insertText: 'tpool_min_elts',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a non-zero value to set the minimum number of data elements involved in a computation that uses the thread pool. If the number of elements in the computation is less than the number you specify, IDL will not use the thread pool for the computation. Use this keyword to prevent IDL from using the thread pool on tasks that are too small to benefit from it.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_MIN_ELTS.',
        },
      },
      {
        label: 'tpool_nothread = ',
        insertText: 'tpool_nothread',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to explicitly prevent IDL from using the thread pool for the current computation. If this keyword is set, IDL will use the non-threaded implementation of the routine even if the current settings of the !CPU system variable would allow use of the threaded implementation.\n\nThis keyword overrides the default value, given by !CPU.TPOOL_NTHREADS.',
        },
      },
      {
        label: 'a',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'b',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'p',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'e',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'var',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
    // define position
    const position_2: Position = { line: 10, character: 15 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'axis_style = ',
        insertText: 'axis_style = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to one of the following values:\n\n* 0 - No axes. Decrease the margins so the graphic almost fills the window. This is the default for images.\n* 1 - Single X, Y (and Z if 3D) axes located at the minimum data value. The margins will be adjusted to leave space for the axes. This is the default for 3D graphics.\n* 2 - Box axes - multiple axes located at both the minimum and maximum data values. The margins will be adjusted to leave space for the axes. This is the default for 2D graphics.\n* 3 - Crosshair-style axes - located at the midpoint of each data dimension. Since the axes are in the middle, decrease the margins so the graphic almost fills the window. This is the default for polar plots.\n* 4 - No axes, but use the same margins as if axes were there. This is useful if you want to later add another graphic that does have axes, and you want the two visualizations to be aligned properly.\n\nYou can set the following properties on the axes:\n\n| Property                 | Description                                                                                                                                                                                                                                                                                                                                                                                                            |\n| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| \\[XYZ\\]COLOR             | A string or RGB vector containing the axis color.                                                                                                                                                                                                                                                                                                                                                                      |\n| \\[XYZ\\]GRIDSTYLE         | A string, integer, or 2-element vector giving the linestyle for tickmarks.                                                                                                                                                                                                                                                                                                                                             |\n| \\[XYZ\\]LOG               | Set to 1 if the axis is logarithmic. The minimum value of the axis range must be greater than zero.                                                                                                                                                                                                                                                                                                                    |\n| \\[XYZ\\]MAJOR             | The number of major tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]MINOR             | The number of minor tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]SUBGRIDSTYLE      | A string, integer, or 2-element vector giving the linestyle for the minor tickmarks. The default is 0, for solid lines. Set to -1 to force minor ticks to have the same linestyle as major ticks.                                                                                                                                                                                                                      |\n| \\[XYZ\\]SHOWTEXT          | Set to 1 to show text labels or 0 to hide the text labels.                                                                                                                                                                                                                                                                                                                                                             |\n| \\[XYZ\\]STYLE             | The axis range style. The valid values are: (0) Nice range. Default for all graphics except Image, Barplot, and Map. (1) Force the exact data range. Default for Image, Barplot, and Map. (2) Pad the axes slightly beyond the nice range. (3) Pad the axes slightly beyond the exact data range. The \\[XYZ\\]RANGE takes precedence over this property.                                                                |\n| \\[XYZ\\]SUBTICKLEN        | The ratio of the minor tick length to the major tick length. The default is 0.5.                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]TEXT\\_COLOR       | A string or RGB vector containing the axis text color.                                                                                                                                                                                                                                                                                                                                                                 |\n| \\[XYZ\\]TEXT\\_ORIENTATION | The angle (in degrees) of the tick mark labels.                                                                                                                                                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TEXTPOS           | Set to 1 to position text above the axis. The default is 0, below the axis.                                                                                                                                                                                                                                                                                                                                            |\n| \\[XYZ\\]THICK             | Set to a floating-point value between 0 and 10 to specify the line thickness for tickmarks. A thickness of 0 gives a thin hairline. The default is 1.                                                                                                                                                                                                                                                                  |\n| \\[XYZ\\]TICKDIR           | Set to 1 to draw the tickmarks facing outwards. The default is 0, facing inwards.                                                                                                                                                                                                                                                                                                                                      |\n| \\[XYZ\\]TICKFONT\\_NAME    | A string containing the font name for the axis text.                                                                                                                                                                                                                                                                                                                                                                   |\n| \\[XYZ\\]TICKFONT\\_SIZE    | The axis text size in points.                                                                                                                                                                                                                                                                                                                                                                                          |\n| \\[XYZ\\]TICKFONT\\_STYLE   | A string or integer containing the font style: normal (0), **bold** (1), _italic_ (2), or **bold italic** (3).                                                                                                                                                                                                                                                                                                         |\n| \\[XYZ\\]TICKFORMAT        | A string or string array of tick label formats. See [Format Codes](https://www.nv5geospatialsoftware.com/docs/Format_Codes_Fortran.html) for more information.                                                                                                                                                                                                                                      |\n| \\[XYZ\\]TICKINTERVAL      | The interval between major tick marks.                                                                                                                                                                                                                                                                                                                                                                                 |\n| \\[XYZ\\]TICKLAYOUT        | Set to 1 to suppress tick marks; set to 2 to draw a box around the tick labels.                                                                                                                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TICKLEN           | The length of each major tick mark, normalized to the width or height of the graphic. The default value is automatically calculated based upon the aspect ratio of the graphic.                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TICKNAME          | A string array containing the tick labels.                                                                                                                                                                                                                                                                                                                                                                             |\n| \\[XYZ\\]TICKUNITS         | A string giving the tick units. Valid values are: null (the default, signified by empty quotes), Years, Months, Days, Hours, Minutes, Seconds, Time, exponent for exponential notation, or scientific for scientific notation. If any of the time units are utilized, then the tick values are interpreted as Julian date/time values. If more than one unit is provided, the axis will be drawn with multiple levels. |\n| \\[XYZ\\]TICKVALUES        | An array of tick mark locations.                                                                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]TITLE             | A string giving the axis title.                                                                                                                                                                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TRANSPARENCY      | An integer from 0-100 giving the percent transparency.                                                                                                                                                                                                                                                                                                                                                                 |\n\nFor more detailed explanations of these properties, see the [AXIS](https://www.nv5geospatialsoftware.com/docs/AXIS.html) function.\n\n**Tip:** You can also use the [AXIS](https://www.nv5geospatialsoftware.com/docs/AXIS.html) function to insert additional axes after the graphic has been created.',
        },
      },
      {
        label: 'buffer = ',
        insertText: '/buffer',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to 1 to direct the graphics to an off-screen buffer instead of creating a window.',
        },
      },
      {
        label: 'current = ',
        insertText: '/current',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to create the graphic in the current window with a new set of axes. If no window exists, a new window is created. The WINDOW's [SetCurrent](https://www.nv5geospatialsoftware.com/docs/SetCurrent%20Method.html) method may be used to set the current window.\n\nOr, set this keyword to an existing IDL Graphic reference to make that window be the current window and direct the new graphic to that window.\n\n**Tip:** The CURRENT keyword is usually used with the LAYOUT keyword or POSITION property to produce a window which has multiple graphics in different locations.\n\n**Tip:** For the graphic share the _same_ axes as an existing graphic, use the OVERPLOT keyword instead.",
        },
      },
      {
        label: 'device = ',
        insertText: '/device',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword if values are specified in device coordinates (pixels) for the MARGIN and POSITION keywords. (Normalized coordinates are the default for these keywords.)',
        },
      },
      {
        label: 'dimensions = ',
        insertText: 'dimensions = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a two-element vector of the form \\[_width_, _height_\\] to specify the window dimensions in pixels. If you do not specify a value for DIMENSIONS, IDL by default uses the values of the IDL\\_GR\\_WIN\\_HEIGHT and IDL\\_GR\\_WIN\\_WIDTH preferences for Windows platforms or the IDL\\_GR\\_X\\_HEIGHT and IDL\\_GR\\_X\\_WIDTH preferences for X Windows systems on UNIX.\n\n**Tip:** The minimum _width_ is set by the toolbar in the window, usually around 400 pixels. To create a smaller graphics window, use the NO\\_TOOLBAR keyword.',
        },
      },
      {
        label: 'layout = ',
        insertText: 'layout = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a three-element vector \\[_ncol_, _nrow_, _index_\\] that arranges graphics in a grid. The first dimension _ncol_ is the number of columns in the grid, _nrow_ is the number of rows, and _index_ is the grid position at which to place the graphic (starting at element 1). This keyword is ignored if either OVERPLOT or POSITION is specified.',
        },
      },
      {
        label: 'location = ',
        insertText: 'location = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a two-element vector \\[_X offset_, _Y offset_\\] giving the window's screen offset in pixels.",
        },
      },
      {
        label: 'margin = ',
        insertText: 'margin = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to the current graphic’s margin values in the layout specified by the LAYOUT property. Use a scalar value to set the same margin on all sides, or use a four-element vector \\[_left_, _bottom_, _right_, _top_\\] to specify different margins on each side.\n\nBy default, margin values are expressed in normalized units ranging from 0.0 to 0.5\\. If the DEVICE keyword is set, the values are given in device units (pixels).\n\nThis keyword is ignored if either OVERPLOT or POSITION is specified.',
        },
      },
      {
        label: 'no_toolbar = ',
        insertText: 'no_toolbar = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "By default the graphics window will have a toolbar containing some common tools such as Print and Save. Set this keyword to remove the toolbar. This keyword has no effect if the window is already created.\n\n**Tip:** When the toolbar exists, the minimum window _width_ is set to the toolbar's width, usually around 400 pixels. To create a smaller graphics window, use the NO\\_TOOLBAR keyword.",
        },
      },
      {
        label: 'nodata = ',
        insertText: 'nodata = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to 1 to create the graphic, but without any data attached to it. The axes and title (if present) are also created and displayed. If the OVERPLOT keyword is specified, axis ranges will not change.\n\n**Note:** You must still provide valid input arguments. The data range of the input arguments are used to automatically set the range of the axes. The \\[XYZ\\]RANGE properties may be used to override these default ranges.',
        },
      },
      {
        label: 'overplot = ',
        insertText: '/overplot',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to 1 (one) to place the graphic on top of the currently-selected graphic within the current window. The two graphics items will then share the same set of axes. If no current window exists, then this keyword is ignored and a new window is created.\n\nIf you have a graphic in another window that is not currently selected, you can also set this keyword to that graphic's reference to overplot on top of that graphic.\n\n**Tip:** For the graphic to have a _new_ set of axes, use the CURRENT keyword instead.",
        },
      },
      {
        label: 'widgets = ',
        insertText: 'widgets = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'By default, when running from the IDL Workbench, the graphics window will use the native widgets for your platform. Set this keyword to instead use IDL widgets for the graphics window. This keyword is ignored when running from the IDL command line, since IDL widgets are always used in that case.',
        },
      },
      {
        label: '_extra = ',
        insertText: '_extra = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'Support for additional keywords',
        },
      },
      {
        label: 'test = ',
        insertText: '/test',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'a',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'b',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'p',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'e',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'var',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2
        )
      ).slice(0, 50)
    );
    // define position
    const position_3: Position = { line: 13, character: 13 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [
      {
        label: 'axis_style = ',
        insertText: 'axis_style',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to one of the following values:\n\n* 0 - No axes. Decrease the margins so the graphic almost fills the window. This is the default for images.\n* 1 - Single X, Y (and Z if 3D) axes located at the minimum data value. The margins will be adjusted to leave space for the axes. This is the default for 3D graphics.\n* 2 - Box axes - multiple axes located at both the minimum and maximum data values. The margins will be adjusted to leave space for the axes. This is the default for 2D graphics.\n* 3 - Crosshair-style axes - located at the midpoint of each data dimension. Since the axes are in the middle, decrease the margins so the graphic almost fills the window. This is the default for polar plots.\n* 4 - No axes, but use the same margins as if axes were there. This is useful if you want to later add another graphic that does have axes, and you want the two visualizations to be aligned properly.\n\nYou can set the following properties on the axes:\n\n| Property                 | Description                                                                                                                                                                                                                                                                                                                                                                                                            |\n| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| \\[XYZ\\]COLOR             | A string or RGB vector containing the axis color.                                                                                                                                                                                                                                                                                                                                                                      |\n| \\[XYZ\\]GRIDSTYLE         | A string, integer, or 2-element vector giving the linestyle for tickmarks.                                                                                                                                                                                                                                                                                                                                             |\n| \\[XYZ\\]LOG               | Set to 1 if the axis is logarithmic. The minimum value of the axis range must be greater than zero.                                                                                                                                                                                                                                                                                                                    |\n| \\[XYZ\\]MAJOR             | The number of major tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]MINOR             | The number of minor tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]SUBGRIDSTYLE      | A string, integer, or 2-element vector giving the linestyle for the minor tickmarks. The default is 0, for solid lines. Set to -1 to force minor ticks to have the same linestyle as major ticks.                                                                                                                                                                                                                      |\n| \\[XYZ\\]SHOWTEXT          | Set to 1 to show text labels or 0 to hide the text labels.                                                                                                                                                                                                                                                                                                                                                             |\n| \\[XYZ\\]STYLE             | The axis range style. The valid values are: (0) Nice range. Default for all graphics except Image, Barplot, and Map. (1) Force the exact data range. Default for Image, Barplot, and Map. (2) Pad the axes slightly beyond the nice range. (3) Pad the axes slightly beyond the exact data range. The \\[XYZ\\]RANGE takes precedence over this property.                                                                |\n| \\[XYZ\\]SUBTICKLEN        | The ratio of the minor tick length to the major tick length. The default is 0.5.                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]TEXT\\_COLOR       | A string or RGB vector containing the axis text color.                                                                                                                                                                                                                                                                                                                                                                 |\n| \\[XYZ\\]TEXT\\_ORIENTATION | The angle (in degrees) of the tick mark labels.                                                                                                                                                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TEXTPOS           | Set to 1 to position text above the axis. The default is 0, below the axis.                                                                                                                                                                                                                                                                                                                                            |\n| \\[XYZ\\]THICK             | Set to a floating-point value between 0 and 10 to specify the line thickness for tickmarks. A thickness of 0 gives a thin hairline. The default is 1.                                                                                                                                                                                                                                                                  |\n| \\[XYZ\\]TICKDIR           | Set to 1 to draw the tickmarks facing outwards. The default is 0, facing inwards.                                                                                                                                                                                                                                                                                                                                      |\n| \\[XYZ\\]TICKFONT\\_NAME    | A string containing the font name for the axis text.                                                                                                                                                                                                                                                                                                                                                                   |\n| \\[XYZ\\]TICKFONT\\_SIZE    | The axis text size in points.                                                                                                                                                                                                                                                                                                                                                                                          |\n| \\[XYZ\\]TICKFONT\\_STYLE   | A string or integer containing the font style: normal (0), **bold** (1), _italic_ (2), or **bold italic** (3).                                                                                                                                                                                                                                                                                                         |\n| \\[XYZ\\]TICKFORMAT        | A string or string array of tick label formats. See [Format Codes](https://www.nv5geospatialsoftware.com/docs/Format_Codes_Fortran.html) for more information.                                                                                                                                                                                                                                      |\n| \\[XYZ\\]TICKINTERVAL      | The interval between major tick marks.                                                                                                                                                                                                                                                                                                                                                                                 |\n| \\[XYZ\\]TICKLAYOUT        | Set to 1 to suppress tick marks; set to 2 to draw a box around the tick labels.                                                                                                                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TICKLEN           | The length of each major tick mark, normalized to the width or height of the graphic. The default value is automatically calculated based upon the aspect ratio of the graphic.                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TICKNAME          | A string array containing the tick labels.                                                                                                                                                                                                                                                                                                                                                                             |\n| \\[XYZ\\]TICKUNITS         | A string giving the tick units. Valid values are: null (the default, signified by empty quotes), Years, Months, Days, Hours, Minutes, Seconds, Time, exponent for exponential notation, or scientific for scientific notation. If any of the time units are utilized, then the tick values are interpreted as Julian date/time values. If more than one unit is provided, the axis will be drawn with multiple levels. |\n| \\[XYZ\\]TICKVALUES        | An array of tick mark locations.                                                                                                                                                                                                                                                                                                                                                                                       |\n| \\[XYZ\\]TITLE             | A string giving the axis title.                                                                                                                                                                                                                                                                                                                                                                                        |\n| \\[XYZ\\]TRANSPARENCY      | An integer from 0-100 giving the percent transparency.                                                                                                                                                                                                                                                                                                                                                                 |\n\nFor more detailed explanations of these properties, see the [AXIS](https://www.nv5geospatialsoftware.com/docs/AXIS.html) function.\n\n**Tip:** You can also use the [AXIS](https://www.nv5geospatialsoftware.com/docs/AXIS.html) function to insert additional axes after the graphic has been created.',
        },
      },
      {
        label: 'buffer = ',
        insertText: 'buffer',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to 1 to direct the graphics to an off-screen buffer instead of creating a window.',
        },
      },
      {
        label: 'current = ',
        insertText: 'current',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to create the graphic in the current window with a new set of axes. If no window exists, a new window is created. The WINDOW's [SetCurrent](https://www.nv5geospatialsoftware.com/docs/SetCurrent%20Method.html) method may be used to set the current window.\n\nOr, set this keyword to an existing IDL Graphic reference to make that window be the current window and direct the new graphic to that window.\n\n**Tip:** The CURRENT keyword is usually used with the LAYOUT keyword or POSITION property to produce a window which has multiple graphics in different locations.\n\n**Tip:** For the graphic share the _same_ axes as an existing graphic, use the OVERPLOT keyword instead.",
        },
      },
      {
        label: 'device = ',
        insertText: 'device',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword if values are specified in device coordinates (pixels) for the MARGIN and POSITION keywords. (Normalized coordinates are the default for these keywords.)',
        },
      },
      {
        label: 'dimensions = ',
        insertText: 'dimensions',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a two-element vector of the form \\[_width_, _height_\\] to specify the window dimensions in pixels. If you do not specify a value for DIMENSIONS, IDL by default uses the values of the IDL\\_GR\\_WIN\\_HEIGHT and IDL\\_GR\\_WIN\\_WIDTH preferences for Windows platforms or the IDL\\_GR\\_X\\_HEIGHT and IDL\\_GR\\_X\\_WIDTH preferences for X Windows systems on UNIX.\n\n**Tip:** The minimum _width_ is set by the toolbar in the window, usually around 400 pixels. To create a smaller graphics window, use the NO\\_TOOLBAR keyword.',
        },
      },
      {
        label: 'layout = ',
        insertText: 'layout',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to a three-element vector \\[_ncol_, _nrow_, _index_\\] that arranges graphics in a grid. The first dimension _ncol_ is the number of columns in the grid, _nrow_ is the number of rows, and _index_ is the grid position at which to place the graphic (starting at element 1). This keyword is ignored if either OVERPLOT or POSITION is specified.',
        },
      },
      {
        label: 'location = ',
        insertText: 'location',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a two-element vector \\[_X offset_, _Y offset_\\] giving the window's screen offset in pixels.",
        },
      },
      {
        label: 'margin = ',
        insertText: 'margin',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to the current graphic’s margin values in the layout specified by the LAYOUT property. Use a scalar value to set the same margin on all sides, or use a four-element vector \\[_left_, _bottom_, _right_, _top_\\] to specify different margins on each side.\n\nBy default, margin values are expressed in normalized units ranging from 0.0 to 0.5\\. If the DEVICE keyword is set, the values are given in device units (pixels).\n\nThis keyword is ignored if either OVERPLOT or POSITION is specified.',
        },
      },
      {
        label: 'no_toolbar = ',
        insertText: 'no_toolbar',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "By default the graphics window will have a toolbar containing some common tools such as Print and Save. Set this keyword to remove the toolbar. This keyword has no effect if the window is already created.\n\n**Tip:** When the toolbar exists, the minimum window _width_ is set to the toolbar's width, usually around 400 pixels. To create a smaller graphics window, use the NO\\_TOOLBAR keyword.",
        },
      },
      {
        label: 'nodata = ',
        insertText: 'nodata',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to 1 to create the graphic, but without any data attached to it. The axes and title (if present) are also created and displayed. If the OVERPLOT keyword is specified, axis ranges will not change.\n\n**Note:** You must still provide valid input arguments. The data range of the input arguments are used to automatically set the range of the axes. The \\[XYZ\\]RANGE properties may be used to override these default ranges.',
        },
      },
      {
        label: 'overplot = ',
        insertText: 'overplot',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to 1 (one) to place the graphic on top of the currently-selected graphic within the current window. The two graphics items will then share the same set of axes. If no current window exists, then this keyword is ignored and a new window is created.\n\nIf you have a graphic in another window that is not currently selected, you can also set this keyword to that graphic's reference to overplot on top of that graphic.\n\n**Tip:** For the graphic to have a _new_ set of axes, use the CURRENT keyword instead.",
        },
      },
      {
        label: 'widgets = ',
        insertText: 'widgets',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'By default, when running from the IDL Workbench, the graphics window will use the native widgets for your platform. Set this keyword to instead use IDL widgets for the graphics window. This keyword is ignored when running from the IDL command line, since IDL widgets are always used in that case.',
        },
      },
      {
        label: '_extra = ',
        insertText: '_extra',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'Support for additional keywords',
        },
      },
      {
        label: 'test = ',
        insertText: 'test',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
    ];

    // verify results
    expect(expectedFound_3).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_3
        )
      ).slice(0, 50)
    );
    // define position
    const position_4: Position = { line: 16, character: 14 };

    // define expected token we extract
    const expectedFound_4: CompletionItem[] = [
      {
        label: 'headless = ',
        insertText: 'headless',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to 1 to start the application without creating the user interface. The WIDGET\\_ID property is 0 when running ENVI in headless mode.',
        },
      },
      {
        label: 'language = ',
        insertText: 'language',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "**Note:** Windows only\n\nSet this property to a string specifying the name of the language to use for the user interface. This property affects components such as menus, buttons and messages. You can also specify the three-character [ISO 639-3 language code](https://iso639-3.sil.org/code%5Ftables/639/data) (for example, jpn for Japanese).\n\nThe following example shows how to set the interface language to Japanese:\n\n```idl\n  e = envi(language = 'jpn')\n```",
        },
      },
      {
        label: 'preferences = ',
        insertText: 'preferences',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves the [ENVIPreferences](https://www.nv5geospatialsoftware.com/docs/ENVIPreferences.html) class associated with the ENVI application. At application start-up, set the PREFERENCES keyword to the URI of a JSON file in which ENVI will load and save preferences.',
        },
      },
      {
        label: 'current = ',
        insertText: 'current',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to get a reference to a currently running instance of ENVI. If this keyword is set and ENVI is not already running, the application will not be launched..',
        },
      },
      {
        label: 'error = ',
        insertText: 'error',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (''). If an error occurs and the routine is a function, then the function result will be undefined.\n\nWhen this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR_STATE and CATCH.",
        },
      },
      {
        label: 'layout = ',
        insertText: 'layout',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
      {
        label: 'log_file = ',
        insertText: 'log_file',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: '',
      },
    ];

    // verify results
    expect(expectedFound_4).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_4
        )
      ).slice(0, 50)
    );
  });
});
