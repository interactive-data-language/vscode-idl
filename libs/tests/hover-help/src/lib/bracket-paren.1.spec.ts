import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provides hover help for`, () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/bracket_paren.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 14, character: 20 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type IDL_Variable.dim = Array<Number>',
      '```',
      '',
      'An array giving the dimensions (0 for scalars).',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_1: Position = { line: 17, character: 21 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type IDL_Variable.tname = String',
      '```',
      '',
      'A string giving the raw IDL type name. For structures this returns "STRUCT", while for objects this returns "OBJREF".',
    ];

    // get hover help
    const hoverHelp_1 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_1
    );

    // verify results
    expect(expectedFound_1).toEqual(
      ((hoverHelp_1?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_2: Position = { line: 17, character: 27 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/IDL_String.html#kanchor4517) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22fm%22,%22name%22:%22IDL_String::contains%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: any',
      ';+',
      'result = IDL_String.contains(substring, $',
      '  /fold_case)',
      '```',
      '',
      'The IDL\\_String::Contains method determines whether the string contains a given substring.',
      '',
      '',
      '#### Arguments',
      '',
      '- **substring**: bidirectional, optional, String',
      '',
      '  The string to compare against.',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **fold_case**: bidirectional, optional, Boolean',
      '',
      '    Set this keyword to ignore case when doing comparisons.',
      '    ',
      '    None',
      '    ',
      '    None',
      '    ',
      '    None',
      '',
      '',
      '',
      '### Examples',
      '',
      'Determine whether each element of a string array contains a specific substring:',
      '',
      '```idl',
      "  str = ['code.pro', 'image.jpg', 'file.txt']",
      "  print, str.contains('.pro')",
      '```',
      '',
      'IDL prints:',
      '',
      '```idl',
      '1  0  0',
      '',
      '```',
      '',
      '### Return Value',
      '',
      'The result is a boolean value 1 (true) if the string contains the substring, or 0 otherwise. If _var_ is an array then _Result_ is a byte array of the same dimensions.',
    ];

    // get hover help
    const hoverHelp_2 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_2
    );

    // verify results
    expect(expectedFound_2).toEqual(
      ((hoverHelp_2?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_3: Position = { line: 20, character: 20 };

    // define expected token we extract
    const expectedFound_3: string[] = [
      '```typescript',
      'type IDL_Variable.typecode = Int',
      '```',
      '',
      'An integer giving the IDL type code.',
    ];

    // get hover help
    const hoverHelp_3 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_3
    );

    // verify results
    expect(expectedFound_3).toEqual(
      ((hoverHelp_3?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_4: Position = { line: 23, character: 25 };

    // define expected token we extract
    const expectedFound_4: string[] = [
      '```typescript',
      'type Plot.axis_style = String',
      '```',
      '',
      'Set this keyword to one of the following values:',
      '',
      '* 0 - No axes. Decrease the margins so the graphic almost fills the window. This is the default for images.',
      '* 1 - Single X, Y (and Z if 3D) axes located at the minimum data value. The margins will be adjusted to leave space for the axes. This is the default for 3D graphics.',
      '* 2 - Box axes - multiple axes located at both the minimum and maximum data values. The margins will be adjusted to leave space for the axes. This is the default for 2D graphics.',
      '* 3 - Crosshair-style axes - located at the midpoint of each data dimension. Since the axes are in the middle, decrease the margins so the graphic almost fills the window. This is the default for polar plots.',
      '* 4 - No axes, but use the same margins as if axes were there. This is useful if you want to later add another graphic that does have axes, and you want the two visualizations to be aligned properly.',
      '',
      'You can set the following properties on the axes:',
      '',
      '| Property                 | Description                                                                                                                                                                                                                                                                                                                                                                                                            |',
      '| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |',
      '| \\[XYZ\\]COLOR             | A string or RGB vector containing the axis color.                                                                                                                                                                                                                                                                                                                                                                      |',
      '| \\[XYZ\\]GRIDSTYLE         | A string, integer, or 2-element vector giving the linestyle for tickmarks.                                                                                                                                                                                                                                                                                                                                             |',
      '| \\[XYZ\\]LOG               | Set to 1 if the axis is logarithmic. The minimum value of the axis range must be greater than zero.                                                                                                                                                                                                                                                                                                                    |',
      '| \\[XYZ\\]MAJOR             | The number of major tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |',
      '| \\[XYZ\\]MINOR             | The number of minor tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |',
      '| \\[XYZ\\]SUBGRIDSTYLE      | A string, integer, or 2-element vector giving the linestyle for the minor tickmarks. The default is 0, for solid lines. Set to -1 to force minor ticks to have the same linestyle as major ticks.                                                                                                                                                                                                                      |',
      '| \\[XYZ\\]SHOWTEXT          | Set to 1 to show text labels or 0 to hide the text labels.                                                                                                                                                                                                                                                                                                                                                             |',
      '| \\[XYZ\\]STYLE             | The axis range style. The valid values are: (0) Nice range. Default for all graphics except Image, Barplot, and Map. (1) Force the exact data range. Default for Image, Barplot, and Map. (2) Pad the axes slightly beyond the nice range. (3) Pad the axes slightly beyond the exact data range. The \\[XYZ\\]RANGE takes precedence over this property.                                                                |',
      '| \\[XYZ\\]SUBTICKLEN        | The ratio of the minor tick length to the major tick length. The default is 0.5.                                                                                                                                                                                                                                                                                                                                       |',
      '| \\[XYZ\\]TEXT\\_COLOR       | A string or RGB vector containing the axis text color.                                                                                                                                                                                                                                                                                                                                                                 |',
      '| \\[XYZ\\]TEXT\\_ORIENTATION | The angle (in degrees) of the tick mark labels.                                                                                                                                                                                                                                                                                                                                                                        |',
      '| \\[XYZ\\]TEXTPOS           | Set to 1 to position text above the axis. The default is 0, below the axis.                                                                                                                                                                                                                                                                                                                                            |',
      '| \\[XYZ\\]THICK             | Set to a floating-point value between 0 and 10 to specify the line thickness for tickmarks. A thickness of 0 gives a thin hairline. The default is 1.                                                                                                                                                                                                                                                                  |',
      '| \\[XYZ\\]TICKDIR           | Set to 1 to draw the tickmarks facing outwards. The default is 0, facing inwards.                                                                                                                                                                                                                                                                                                                                      |',
      '| \\[XYZ\\]TICKFONT\\_NAME    | A string containing the font name for the axis text.                                                                                                                                                                                                                                                                                                                                                                   |',
      '| \\[XYZ\\]TICKFONT\\_SIZE    | The axis text size in points.                                                                                                                                                                                                                                                                                                                                                                                          |',
      '| \\[XYZ\\]TICKFONT\\_STYLE   | A string or integer containing the font style: normal (0), **bold** (1), _italic_ (2), or **bold italic** (3).                                                                                                                                                                                                                                                                                                         |',
      '| \\[XYZ\\]TICKFORMAT        | A string or string array of tick label formats. See [Format Codes](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Creating%20IDL%20Programs/Components%20of%20the%20IDL%20Language/Format%255FCodes%255FFortran.htm%22%7D) for more information.                                                                                                                                                                                                                                      |',
      '| \\[XYZ\\]TICKINTERVAL      | The interval between major tick marks.                                                                                                                                                                                                                                                                                                                                                                                 |',
      '| \\[XYZ\\]TICKLAYOUT        | Set to 1 to suppress tick marks; set to 2 to draw a box around the tick labels.                                                                                                                                                                                                                                                                                                                                        |',
      '| \\[XYZ\\]TICKLEN           | The length of each major tick mark, normalized to the width or height of the graphic. The default value is automatically calculated based upon the aspect ratio of the graphic.                                                                                                                                                                                                                                        |',
      '| \\[XYZ\\]TICKNAME          | A string array containing the tick labels.                                                                                                                                                                                                                                                                                                                                                                             |',
      '| \\[XYZ\\]TICKUNITS         | A string giving the tick units. Valid values are: null (the default, signified by empty quotes), Years, Months, Days, Hours, Minutes, Seconds, Time, exponent for exponential notation, or scientific for scientific notation. If any of the time units are utilized, then the tick values are interpreted as Julian date/time values. If more than one unit is provided, the axis will be drawn with multiple levels. |',
      '| \\[XYZ\\]TICKVALUES        | An array of tick mark locations.                                                                                                                                                                                                                                                                                                                                                                                       |',
      '| \\[XYZ\\]TITLE             | A string giving the axis title.                                                                                                                                                                                                                                                                                                                                                                                        |',
      '| \\[XYZ\\]TRANSPARENCY      | An integer from 0-100 giving the percent transparency.                                                                                                                                                                                                                                                                                                                                                                 |',
      '',
      'For more detailed explanations of these properties, see the [AXIS](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/A/AXIS.htm%22%7D) function.',
      '',
      '_Tip:_ You can also use the [AXIS](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/A/AXIS.htm%22%7D) function to insert additional axes after the graphic has been created.',
    ];

    // get hover help
    const hoverHelp_4 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_4
    );

    // verify results
    expect(expectedFound_4).toEqual(
      ((hoverHelp_4?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_5: Position = { line: 24, character: 13 };

    // define expected token we extract
    const expectedFound_5: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22pm%22,%22name%22:%22Plot::save%22%7D)',
      '',
      '```idl',
      'Plot.save, filename, $',
      '  antialias = value, $',
      '  /append, $',
      '  /bit_depth, $',
      '  bitmap = value, $',
      '  border = value, $',
      '  /centimeters, $',
      '  close = value, $',
      '  /cmyk, $',
      '  /compression, $',
      '  height = value, $',
      '  /landscape, $',
      '  /memory, $',
      '  page_size = value, $',
      '  resolution = value, $',
      '  /reversible, $',
      '  transparent = value, $',
      '  width = value, $',
      '  xmargin = value, $',
      '  ymargin = value',
      '```',
      '',
      '![](https://www.nv5geospatialsoftware.com/docs/html/images/save_method_ex.gif) ',
      '',
      'The Save method saves the window contents of an IDL Graphic to an image file.',
      '',
      '',
      '#### Arguments',
      '',
      '- **filename**: bidirectional, optional, String',
      '',
      '  A string containing the full pathname of the file to which the graphic should be written.',
      '  ',
      '  The file format of the saved file is determined from the _Filename_ file suffix. For example, if _Filename_ is `image.bmp`, the file is saved in bitmap format.',
      '  ',
      '  The supported file formats are listed in the following table:',
      '  ',
      '  | File Suffix   | File Format                             | Allowed Keywords                                                                                               |',
      '  | ------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |',
      '  | BMP           | Windows bitmap                          | ANTIALIAS, BORDER, TRANSPARENT, RESOLUTION, WIDTH, HEIGHT                                                      |',
      '  | EMF           | Windows enhanced metafile               | BITMAP, RESOLUTION, WIDTH, HEIGHT                                                                              |',
      '  | EPS, PS       | Encapsulated PostScript                 | BITMAP, CMYK, RESOLUTION, WIDTH, HEIGHT                                                                        |',
      '  | GIF           | GIF image                               | ANTIALIAS, APPEND, BORDER, CLOSE, RESOLUTION, WIDTH, HEIGHT                                                    |',
      '  | JPG, JPEG     | JPEG image                              | ANTIALIAS, BORDER, RESOLUTION, WIDTH, HEIGHT                                                                   |',
      '  | JP2, JPX, J2K | JPEG2000 image                          | ANTIALIAS, BORDER, REVERSIBLE, RESOLUTION, WIDTH, HEIGHT                                                       |',
      '  | KML           | OGC Keyhole Markup Language             |                                                                                                                |',
      '  | KMZ           | A compressed and zipped version of KML. |                                                                                                                |',
      '  | PDF           | Portable document format                | APPEND, BITMAP, CENTIMETERS, CLOSE, LANDSCAPE, MEMORY, PAGE\\_SIZE, XMARGIN, YMARGIN, RESOLUTION, WIDTH, HEIGHT |',
      '  | PICT          | Mac PICT image                          | ANTIALIAS, BIT\\_DEPTH, BORDER, RESOLUTION, WIDTH, HEIGHT                                                       |',
      '  | PNG           | PNG image                               | ANTIALIAS, BIT\\_DEPTH, BORDER, TRANSPARENT, RESOLUTION, WIDTH, HEIGHT                                          |',
      '  | SVG           | Scalable Vector Graphics                | BITMAP, RESOLUTION, WIDTH, HEIGHT                                                                              |',
      '  | TIF, TIFF     | TIFF image                              | ANTIALIAS, BIT\\_DEPTH, BORDER, CMYK, COMPRESSION, TRANSPARENT, RESOLUTION, WIDTH, HEIGHT                       |',
      '  ',
      '  _Note:_ Support for SVG is highly dependent upon the vendor and version of your web browser. Certain features of SVG (such as text layout, linestyles, or colors) may look different in different web browsers, or may be rendered incorrectly. In this case, we recommend that you experiment with different web browsers.',
      '  ',
      '  _Note:_ If the APPEND keyword was used in the previous call to the Save method, the _Filename_ will be ignored.',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **antialias**: bidirectional, optional, any',
      '',
      '    By default, when doing output to bitmap file formats, if the output resolution is less than 300 dots-per-inch, then IDL will automatically use anti-aliasing to create a smoother-looking output image. Set this keyword to 0 to disable anti-aliasing. This keyword is ignored for vector file formats.',
      '',
      '- **append**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for GIF and PDF files.',
      '    ',
      '    Set this keyword to keep the file open after writing out the graphics. The next call to the Save method will then append the new graphics onto the same file, ignoring _Filename_. In the final call to Save you should specify both /APPEND and /CLOSE to ensure that the file is closed. See Additional Examples for a code sample that uses APPEND.',
      '    ',
      '    _Note:_ When creating multi-image GIF files, the Save method with /APPEND may be called either from the same graphics object or different graphics objects. In either case, you should ensure that the image dimensions are the same for each call to the Save method.',
      '    ',
      '    _Note:_ When creating multi-page PDF files, the Save method with /APPEND may be called either from the same graphics object or different graphics objects. In either case, a new page will be added to the PDF file for each call to the Save method.',
      '',
      '- **bit_depth**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for PICT, PNG, and TIFF files.',
      '    ',
      '    Set this keyword to one of the following values:',
      '    ',
      '    | 0 | Automatic (the default is 24-bit for all formats except PICT, which only supports 8-bit) |',
      '    | - | ---------------------------------------------------------------------------------------- |',
      '    | 1 | 8-bit (indexed color)                                                                    |',
      '    | 2 | 24-bit                                                                                   |',
      '',
      '- **bitmap**: bidirectional, optional, any',
      '',
      '    _Note:_ This keyword is valid only for EMF, EPS, PDF, and SVG files.',
      '    ',
      '    For EMF, EPS, PDF, and SVG files, the default behavior is to output 2D graphics (such as PLOTs and CONTOURs) in vector format, and 3D graphics in bitmap format. Set this keyword to 1 to force output in bitmap format, or to 0 to force output in vector format. Files in bitmap format will be larger but may give more accurate output (especially for transparency and 3D graphics). Files in vector format will be smaller and allow the resulting file to be edited in external programs.',
      '',
      '- **border**: bidirectional, optional, any',
      '',
      '    By default, the saved graphic includes all of the background regions around the graphic, out to the edge of the window. Set this keyword to an integer defining the width of the border around the graphic. For example, setting BORDER=0 will trim the graphic so that there are no extra border pixels surrounding the graphic. This keyword is ignored if the output is in vector format (BITMAP=0).',
      '',
      '- **centimeters**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for PDF files.',
      '    ',
      '    Set this keyword to indicate that the PAGESIZE, WIDTH, HEIGHT, XMARGIN, and YMARGIN values are in centimeters. The default is inches.',
      '',
      '- **close**: bidirectional, optional, any',
      '',
      '    _Note:_ This keyword is valid only for GIF and PDF files.',
      '    ',
      '    After writing multiple images with the APPEND keyword, use this keyword on the final call to the Save method. For GIF files, CLOSE saves the data and properly closes the file. For PDF files, CLOSE clears the buffer.',
      '    ',
      '    See Additional Examples for a code sample that uses CLOSE.',
      '',
      '- **cmyk**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for EPS and TIFF files.',
      '    ',
      '    Set this keyword to save the output image in CMYK format. The default format is RGB. This keyword is ignored if TRANSPARENT is set.',
      '',
      '- **compression**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for TIFF files.',
      '    ',
      '    Set this keyword to 0 for no compression (the default), to 1 for Pack bits compression, or to 2 for JPEG compression.',
      '',
      '- **height**: bidirectional, optional, any',
      '',
      "    For image or bitmap files, set this keyword to the height in pixels of the output image. If this keyword is set, the RESOLUTION keyword is ignored and the width is automatically calculated from the window's aspect ratio.",
      '    ',
      "    For EPS and PDF files, set this keyword to the height in inches (or centimeters if CENTIMETERS is set) of the graphics output. If this keyword is set, the width is automatically calculated from the window's aspect ratio.",
      '',
      '- **landscape**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for PDF files.',
      '    ',
      '    Set this keyword to indicate that the PDF output should be drawn in landscape orientation. The default is portrait orientation.',
      '',
      '- **memory**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for PDF files.',
      '    ',
      '    Set this keyword to prevent IDL from writing out intermediate results when using APPEND.',
      '',
      '- **page_size**: bidirectional, optional, any',
      '',
      '    _Note:_ This keyword is valid only for PDF files.',
      '    ',
      '    Set this keyword to a string or a two-element vector \\[_width_, _height_\\] giving the page size in inches (or centimeters if CENTIMETERS is set). The default value is \\[8.5, 11\\]. Allowed string values are "Letter", "Legal", "A4", and "A5".',
      '',
      '- **resolution**: bidirectional, optional, any',
      '',
      '    Set this keyword to the output resolution (in dots per inch) to use when saving the window to an image or bitmap file format. If this keyword is not supplied, a default value of 600 DPI is used. The maximum output dimensions are 8192 x 8192\\. If the output dimensions are larger than these values, the resolution will be automatically reduced. This keyword is ignored if the output is in vector format (BITMAP=0).',
      '',
      '- **reversible**: bidirectional, optional, Boolean',
      '',
      '    _Note:_ This keyword is valid only for JPEG2000 files.',
      '    ',
      '    Set this keyword to use reversible (lossless) compression. The default behavior is to use irreversible (lossy) compression.',
      '',
      '- **transparent**: bidirectional, optional, any',
      '',
      '    _Note:_ This keyword is valid only for PNG and TIFF files.',
      '    ',
      '    Set this keyword to an RGB value (a three-element vector of the form \\[_R, G, B_\\]) indicating which pixels in the output image should be made transparent. If this keyword is set to 1, the color of the lower left pixel in the image is used as the transparent color.',
      '',
      '- **width**: bidirectional, optional, any',
      '',
      "    For image or bitmap files, set this keyword to the width in pixels of the output image. If this keyword is set, the RESOLUTION keyword is ignored and the height is automatically calculated from the window's aspect ratio.",
      '    ',
      "    For EPS and PDF files, set this keyword to the width in inches (or centimeters if CENTIMETERS is set) of the graphics output. If this keyword is set, the height is automatically calculated from the window's aspect ratio.",
      '',
      '- **xmargin**: bidirectional, optional, any',
      '',
      '    _Note:_ This keyword is valid only for PDF files.',
      '    ',
      '    Set this keyword to the x-offset from the lower-left corner of the page in inches (or centimeters if CENTIMETERS is set). The default behavior is to center the graphics on the page.',
      '',
      '- **ymargin**: bidirectional, optional, any',
      '',
      '    _Note:_ This keyword is valid only for PDF files.',
      '    ',
      '    Set this keyword to the y-offset from the lower-left corner of the page in inches (or centimeters if CENTIMETERS is set). The default behavior is to center the graphics on the page.',
      '',
      '',
      '',
      '### Example',
      '',
      'The following code sample creates a bar plot and saves the image to a PNG file.',
      '',
      '```idl',
      '  x = findgen(41) / 10 - 2',
      '  gauss = exp(-x ^ 2)',
      "  myPlot = barplot(x, gauss, title = 'Gaussian Distribution', $",
      "    xtitle = '$\\it x$', ytitle = '$\\it f(x)$', yrange = [0, 1.1])",
      "  myText = text(0.75, 0.85, '$\\it f(x)=exp(-x^2)$', /data, font_size = 24)",
      "  myPlot.save, 'gaussian.png', border = 10, resolution = 300, /transparent",
      '```',
      '',
      '### Additional Examples',
      '',
      'See Additional Examples for more code examples using the Save method.',
      '',
      '### Additional Examples',
      '',
      'The following example uses three plot graphics to create a multi-page PDF file. Each time we call the Save method we use the /APPEND keyword, and on the last call we add the /CLOSE keyword to clear out the PDF buffer.',
      '',
      '```idl',
      '  pro appendPDF_ex',
      '    compile_opt idl2',
      '',
      '    ; Create an array of graphic pointers',
      '    p = objarr(3)',
      '',
      '    ; Create three plots with random data',
      '    for i = 0, 2 do begin',
      '      t = 0.1 * findgen(50)',
      '      y = smooth(randomu(seed, 50), 5)',
      "      p[i] = plot(t, y, 'b', symbol = 'D', $",
      "        title = 'Observation' + string(i + 1))",
      '    endfor',
      '',
      '    ; Build the multi-page PDF file, one page at a time',
      "    p[0].save, 'data1.pdf', /append",
      "    p[1].save, 'data1.pdf', /append",
      "    p[2].save, 'data1.pdf', /append, /close",
      '  end',
      '```',
    ];

    // get hover help
    const hoverHelp_5 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_5
    );

    // verify results
    expect(expectedFound_5).toEqual(
      ((hoverHelp_5?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
