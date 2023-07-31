import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly does not provide hover help`, () => {
  it(`[auto generated] for end tokens but does for the beginning`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/hover-help/middle_functions.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 6 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/PLOT.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22plot%22%7D)',
      '',
      '```idl',
      'result = plot( [ x ], [ y ], [ format ], [ equation ], $',
      ' [ axis_style = String ], $',
      ' [ /buffer ], $',
      ' [ /current ], $',
      ' [ /device ], $',
      ' [ dimensions = any ], $',
      ' [ layout = any ], $',
      ' [ location = any ], $',
      ' [ margin = any ], $',
      ' [ no_toolbar = any ], $',
      ' [ nodata = String ], $',
      ' [ /overplot ], $',
      ' [ widgets = any ], $',
      ' [ _extra = any ], $',
      ' [ /test ])',
      '```',
      '',
      'The PLOT function draws a line plot of vector arguments. If one parameter is used, the vector parameter is plotted on the ordinate versus the point number on the abscissa. To plot one vector as a function of another, use two parameters.',
      '',
      'Instead of data, you can also input an equation of _X_ using either the input argument or the EQUATION property. In this case IDL will automatically generate the independent _X_ data and use your equation to compute the dependent _Y_ data.',
      '',
      '![](https://www.nv5geospatialsoftware.com/docs/html/images/plot1_ex.png) ',
      '',
      '#### Arguments',
      '',
      '- **x**: bidirectional, optional, any',
      '',
      '   A vector representing the abscissa values to be plotted. If X is not specified, _Y_ is plotted as a function of point number (starting at zero). If both arguments are provided, Y is plotted as a function of _X_. ',
      '',
      '- **y**: bidirectional, optional, any',
      '',
      '   The ordinate data to be plotted.',
      '',
      '- **format**: bidirectional, optional, String',
      '',
      "  A string that sets line and symbol format properties using short tokens to represent color, symbol, linestyle, and thickness values. For example, to create a plot with a solid red line of thickness 2, using the '+' symbol to mark data points, you would use the following:",
      '  ',
      '  ```idl',
      "    p = plot(data, '-r2+')",
      '  ```',
      '  ',
      '  Tokens in the _Format_ string represent values of the LINESTYLE, COLOR, THICK, and SYMBOL properties. From one to four tokens can be present, and the tokens may be in any order. Tokens are case sensitive. For more information about the syntax of the _Format_ argument, see [Formatting IDL Graphics Symbols and Lines](https://www.nv5geospatialsoftware.com/docs/FormattingSymsAndLines.html).',
      '',
      '- **equation**: bidirectional, optional, any',
      '',
      '   If the first argument is a string, then it is assumed to represent either an equation of _X_ or the name of an IDL function that accepts an input argument _X_. Setting this argument is the same as setting the EQUATION property. See EQUATION for details.',
      '',
      '',
      '#### Keywords',
      '',
      '- **axis_style**: bidirectional, optional, String',
      '',
      '    Set this keyword to one of the following values:',
      '    ',
      '    * 0 - No axes. Decrease the margins so the graphic almost fills the window. This is the default for images.',
      '    * 1 - Single X, Y (and Z if 3D) axes located at the minimum data value. The margins will be adjusted to leave space for the axes. This is the default for 3D graphics.',
      '    * 2 - Box axes - multiple axes located at both the minimum and maximum data values. The margins will be adjusted to leave space for the axes. This is the default for 2D graphics.',
      '    * 3 - Crosshair-style axes - located at the midpoint of each data dimension. Since the axes are in the middle, decrease the margins so the graphic almost fills the window. This is the default for polar plots.',
      '    * 4 - No axes, but use the same margins as if axes were there. This is useful if you want to later add another graphic that does have axes, and you want the two visualizations to be aligned properly.',
      '    ',
      '    You can set the following properties on the axes:',
      '    ',
      '    | Property                 | Description                                                                                                                                                                                                                                                                                                                                                                                                            |',
      '    | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |',
      '    | \\[XYZ\\]COLOR             | A string or RGB vector containing the axis color.                                                                                                                                                                                                                                                                                                                                                                      |',
      '    | \\[XYZ\\]GRIDSTYLE         | A string, integer, or 2-element vector giving the linestyle for tickmarks.                                                                                                                                                                                                                                                                                                                                             |',
      '    | \\[XYZ\\]LOG               | Set to 1 if the axis is logarithmic. The minimum value of the axis range must be greater than zero.                                                                                                                                                                                                                                                                                                                    |',
      '    | \\[XYZ\\]MAJOR             | The number of major tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |',
      '    | \\[XYZ\\]MINOR             | The number of minor tick marks. Set to -1 to auto-compute, set to 0 to suppress.                                                                                                                                                                                                                                                                                                                                       |',
      '    | \\[XYZ\\]SUBGRIDSTYLE      | A string, integer, or 2-element vector giving the linestyle for the minor tickmarks. The default is 0, for solid lines. Set to -1 to force minor ticks to have the same linestyle as major ticks.                                                                                                                                                                                                                      |',
      '    | \\[XYZ\\]SHOWTEXT          | Set to 1 to show text labels or 0 to hide the text labels.                                                                                                                                                                                                                                                                                                                                                             |',
      '    | \\[XYZ\\]STYLE             | The axis range style. The valid values are: (0) Nice range. Default for all graphics except Image, Barplot, and Map. (1) Force the exact data range. Default for Image, Barplot, and Map. (2) Pad the axes slightly beyond the nice range. (3) Pad the axes slightly beyond the exact data range. The \\[XYZ\\]RANGE takes precedence over this property.                                                                |',
      '    | \\[XYZ\\]SUBTICKLEN        | The ratio of the minor tick length to the major tick length. The default is 0.5.                                                                                                                                                                                                                                                                                                                                       |',
      '    | \\[XYZ\\]TEXT\\_COLOR       | A string or RGB vector containing the axis text color.                                                                                                                                                                                                                                                                                                                                                                 |',
      '    | \\[XYZ\\]TEXT\\_ORIENTATION | The angle (in degrees) of the tick mark labels.                                                                                                                                                                                                                                                                                                                                                                        |',
      '    | \\[XYZ\\]TEXTPOS           | Set to 1 to position text above the axis. The default is 0, below the axis.                                                                                                                                                                                                                                                                                                                                            |',
      '    | \\[XYZ\\]THICK             | Set to a floating-point value between 0 and 10 to specify the line thickness for tickmarks. A thickness of 0 gives a thin hairline. The default is 1.                                                                                                                                                                                                                                                                  |',
      '    | \\[XYZ\\]TICKDIR           | Set to 1 to draw the tickmarks facing outwards. The default is 0, facing inwards.                                                                                                                                                                                                                                                                                                                                      |',
      '    | \\[XYZ\\]TICKFONT\\_NAME    | A string containing the font name for the axis text.                                                                                                                                                                                                                                                                                                                                                                   |',
      '    | \\[XYZ\\]TICKFONT\\_SIZE    | The axis text size in points.                                                                                                                                                                                                                                                                                                                                                                                          |',
      '    | \\[XYZ\\]TICKFONT\\_STYLE   | A string or integer containing the font style: normal (0), **bold** (1), _italic_ (2), or **bold italic** (3).                                                                                                                                                                                                                                                                                                         |',
      '    | \\[XYZ\\]TICKFORMAT        | A string or string array of tick label formats. See [Format Codes](https://www.nv5geospatialsoftware.com/docs/Format_Codes_Fortran.html) for more information.                                                                                                                                                                                                                                      |',
      '    | \\[XYZ\\]TICKINTERVAL      | The interval between major tick marks.                                                                                                                                                                                                                                                                                                                                                                                 |',
      '    | \\[XYZ\\]TICKLAYOUT        | Set to 1 to suppress tick marks; set to 2 to draw a box around the tick labels.                                                                                                                                                                                                                                                                                                                                        |',
      '    | \\[XYZ\\]TICKLEN           | The length of each major tick mark, normalized to the width or height of the graphic. The default value is automatically calculated based upon the aspect ratio of the graphic.                                                                                                                                                                                                                                        |',
      '    | \\[XYZ\\]TICKNAME          | A string array containing the tick labels.                                                                                                                                                                                                                                                                                                                                                                             |',
      '    | \\[XYZ\\]TICKUNITS         | A string giving the tick units. Valid values are: null (the default, signified by empty quotes), Years, Months, Days, Hours, Minutes, Seconds, Time, exponent for exponential notation, or scientific for scientific notation. If any of the time units are utilized, then the tick values are interpreted as Julian date/time values. If more than one unit is provided, the axis will be drawn with multiple levels. |',
      '    | \\[XYZ\\]TICKVALUES        | An array of tick mark locations.                                                                                                                                                                                                                                                                                                                                                                                       |',
      '    | \\[XYZ\\]TITLE             | A string giving the axis title.                                                                                                                                                                                                                                                                                                                                                                                        |',
      '    | \\[XYZ\\]TRANSPARENCY      | An integer from 0-100 giving the percent transparency.                                                                                                                                                                                                                                                                                                                                                                 |',
      '    ',
      '    For more detailed explanations of these properties, see the [AXIS](https://www.nv5geospatialsoftware.com/docs/AXIS.html) function.',
      '    ',
      '    **Tip:** You can also use the [AXIS](https://www.nv5geospatialsoftware.com/docs/AXIS.html) function to insert additional axes after the graphic has been created.',
      '',
      '- **buffer**: bidirectional, optional, Boolean',
      '',
      '    Set this keyword to 1 to direct the graphics to an off-screen buffer instead of creating a window.',
      '',
      '- **current**: bidirectional, optional, Boolean',
      '',
      "    Set this keyword to create the graphic in the current window with a new set of axes. If no window exists, a new window is created. The WINDOW's [SetCurrent](https://www.nv5geospatialsoftware.com/docs/SetCurrent%20Method.html) method may be used to set the current window.",
      '    ',
      '    Or, set this keyword to an existing IDL Graphic reference to make that window be the current window and direct the new graphic to that window.',
      '    ',
      '    **Tip:** The CURRENT keyword is usually used with the LAYOUT keyword or POSITION property to produce a window which has multiple graphics in different locations.',
      '    ',
      '    **Tip:** For the graphic share the _same_ axes as an existing graphic, use the OVERPLOT keyword instead.',
      '',
      '- **device**: bidirectional, optional, Boolean',
      '',
      '    Set this keyword if values are specified in device coordinates (pixels) for the MARGIN and POSITION keywords. (Normalized coordinates are the default for these keywords.)',
      '',
      '- **dimensions**: bidirectional, optional, any',
      '',
      '    Set this keyword to a two-element vector of the form \\[_width_, _height_\\] to specify the window dimensions in pixels. If you do not specify a value for DIMENSIONS, IDL by default uses the values of the IDL\\_GR\\_WIN\\_HEIGHT and IDL\\_GR\\_WIN\\_WIDTH preferences for Windows platforms or the IDL\\_GR\\_X\\_HEIGHT and IDL\\_GR\\_X\\_WIDTH preferences for X Windows systems on UNIX.',
      '    ',
      '    **Tip:** The minimum _width_ is set by the toolbar in the window, usually around 400 pixels. To create a smaller graphics window, use the NO\\_TOOLBAR keyword.',
      '',
      '- **layout**: bidirectional, optional, any',
      '',
      '    Set this keyword to a three-element vector \\[_ncol_, _nrow_, _index_\\] that arranges graphics in a grid. The first dimension _ncol_ is the number of columns in the grid, _nrow_ is the number of rows, and _index_ is the grid position at which to place the graphic (starting at element 1). This keyword is ignored if either OVERPLOT or POSITION is specified.',
      '',
      '- **location**: bidirectional, optional, any',
      '',
      "    Set this keyword to a two-element vector \\[_X offset_, _Y offset_\\] giving the window's screen offset in pixels.",
      '',
      '- **margin**: bidirectional, optional, any',
      '',
      '    Set this keyword to the current graphic’s margin values in the layout specified by the LAYOUT property. Use a scalar value to set the same margin on all sides, or use a four-element vector \\[_left_, _bottom_, _right_, _top_\\] to specify different margins on each side.',
      '    ',
      '    By default, margin values are expressed in normalized units ranging from 0.0 to 0.5\\. If the DEVICE keyword is set, the values are given in device units (pixels).',
      '    ',
      '    This keyword is ignored if either OVERPLOT or POSITION is specified.',
      '',
      '- **no_toolbar**: bidirectional, optional, any',
      '',
      '    By default the graphics window will have a toolbar containing some common tools such as Print and Save. Set this keyword to remove the toolbar. This keyword has no effect if the window is already created.',
      '    ',
      "    **Tip:** When the toolbar exists, the minimum window _width_ is set to the toolbar's width, usually around 400 pixels. To create a smaller graphics window, use the NO\\_TOOLBAR keyword.",
      '',
      '- **nodata**: bidirectional, optional, String',
      '',
      '    Set this keyword to 1 to create the graphic, but without any data attached to it. The axes and title (if present) are also created and displayed. If the OVERPLOT keyword is specified, axis ranges will not change.',
      '    ',
      '    **Note:** You must still provide valid input arguments. The data range of the input arguments are used to automatically set the range of the axes. The \\[XYZ\\]RANGE properties may be used to override these default ranges.',
      '',
      '- **overplot**: bidirectional, optional, Boolean',
      '',
      '    Set this keyword to 1 (one) to place the graphic on top of the currently-selected graphic within the current window. The two graphics items will then share the same set of axes. If no current window exists, then this keyword is ignored and a new window is created.',
      '    ',
      "    If you have a graphic in another window that is not currently selected, you can also set this keyword to that graphic's reference to overplot on top of that graphic.",
      '    ',
      '    **Tip:** For the graphic to have a _new_ set of axes, use the CURRENT keyword instead.',
      '',
      '- **widgets**: bidirectional, optional, any',
      '',
      '    By default, when running from the IDL Workbench, the graphics window will use the native widgets for your platform. Set this keyword to instead use IDL widgets for the graphics window. This keyword is ignored when running from the IDL command line, since IDL widgets are always used in that case.',
      '',
      '- **_extra**: bidirectional, optional, any',
      '',
      '    Support for additional keywords',
      '',
      '- **test**: in, optional, Boolean',
      '',
      '    ',
      '',
      '',
      '### Example',
      '',
      'The following lines create the plot shown above.',
      '',
      '```idl',
      '  ; Create data representing the sine wave',
      '  theory = sin(2.0 * findgen(200) * !pi / 25.0) * exp(-0.02 * findgen(200))',
      '',
      '  ; Create the plot',
      "  p = plot(theory, 'r4D-', ytitle = 'Resistance ($\\Omega$)', $",
      "    title = 'Circuit Resistance', dim = [450, 400], margin = 0.2)",
      '',
      '  ; Set some properties',
      '  p.sym_increment = 5',
      "  p.sym_color = 'blue'",
      '  p.sym_filled = 1',
      '  p.sym_fill_color = 0',
      '```',
      '',
      '### Additional Examples',
      '',
      'See [Plot examples](https://www.nv5geospatialsoftware.com/docs/visualize.html) for additional examples using the PLOT function.',
      '### Return Value',
      '',
      'The PLOT function returns a reference to the created graphic. Use the returned reference to manipulate the graphic after creation by changing properties or calling methods.',
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
    const position_1: Position = { line: 3, character: 10 };

    // define expected token we extract
    const expectedFound_1: string[] = [''];

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
  });
});
