import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Basic checks for call_function() hover help`, () => {
  it(`[auto generated] for function`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/call_function.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 18 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/ENVI.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22f%22,%22name%22:%22envi%22%7D)',
      '',
      '```idl',
      ';+',
      '; :Returns: ENVI',
      ';+',
      'result = envi( $',
      '  /headless $',
      '  language = value $',
      '  preferences = value $',
      '  /current $',
      '  error = value $',
      '  layout = value $',
      '  log_file = value)',
      '```',
      '',
      'The ENVI function launches the ENVI application and returns an object reference to the application.',
      '',
      '_Note:_ The ENVI interface and ENVI Classic interface should not be started within the same IDL session. ',
      '',
      '',
      '#### Keywords',
      '',
      '- **headless**: in, optional, Boolean',
      '',
      '    Set this property to 1 to start the application without creating the user interface. The WIDGET\\_ID property is 0 when running ENVI in headless mode.',
      '',
      '- **language**: in, optional, String',
      '',
      '    _Note:_ Windows only',
      '    ',
      '    Set this property to a string specifying the name of the language to use for the user interface. This property affects components such as menus, buttons and messages. You can also specify the three-character [ISO 639-3 language code](https://iso639-3.sil.org/code%5Ftables/639/data) (for example, jpn for Japanese).',
      '    ',
      '    The following example shows how to set the interface language to Japanese:',
      '    ',
      '    ```idl',
      "      e = envi(language = 'jpn')",
      '    ```',
      '',
      '- **preferences**: bidirectional, optional, any',
      '',
      '    This property retrieves the [ENVIPreferences](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIPreferences/ENVIPreferences.htm%22%7D) class associated with the ENVI application. At application start-up, set the PREFERENCES keyword to the URI of a JSON file in which ENVI will load and save preferences.',
      '',
      '- **current**: in, optional, Boolean',
      '',
      '    Set this keyword to get a reference to a currently running instance of ENVI. If this keyword is set and ENVI is not already running, the application will not be launched..',
      '',
      '- **error**: out, optional, String',
      '',
      "    Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (''). If an error occurs and the routine is a function, then the function result will be undefined.",
      '    ',
      "    When this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR_STATE and CATCH.",
      '',
      '- **layout**: in, optional, Array<Number>',
      '',
      '    ',
      '',
      '- **log_file**: in, optional, String',
      '',
      '    ',
      '',
      '',
      '',
      '### Example 1',
      '',
      'Copy and paste the following code into the IDL command line:',
      '',
      '```idl',
      '  ; Launch the application',
      '  e = envi()',
      '',
      '  ; Open a file',
      "  file = filepath('qb_boulder_msi', root_dir = e.root_dir, $",
      "    subdirectory = ['data'])",
      '  raster = e.openRaster(file)',
      '',
      '  ; Display the data',
      '  view = e.getView()',
      '  layer = view.createLayer(raster)',
      '```',
      '',
      '### Example 2',
      '',
      'Copy and paste the following code into the IDL command line:',
      '',
      '```idl',
      '  ; Launch the application with two vertical views',
      '  e = envi(layout = [2, 1])',
      '',
      '  ; Open a file',
      "  file = filepath('qb_boulder_msi', root_dir = e.root_dir, $",
      "    subdirectory = ['data'])",
      '  raster = e.openRaster(file)',
      '```',
      '',
      'Display the data in two views:',
      '',
      '```idl',
      '  views = e.getView(/all)',
      '  layer1 = views[0].createLayer(raster)',
      '  layer2 = views[1].createLayer(raster, /cir)',
      '```',
      '',
      'Create a third view:',
      '',
      '```idl',
      '  view3 = e.createView()',
      '```',
      '',
      'Switch back to one (empty) view:',
      '',
      '```idl',
      '  e.layout = [1, 1]',
      '```',
      '',
      '### Return Value',
      '',
      'The ENVI function returns a reference to the ENVI application. Use the returned reference to manipulate the application after creation by changing properties or calling methods.',
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
  });

  it(`[auto generated] for keywords`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/call_function.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 34 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type headless = Boolean',
      '```',
      '',
      'Set this property to 1 to start the application without creating the user interface. The WIDGET\\_ID property is 0 when running ENVI in headless mode.',
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
  });
});
