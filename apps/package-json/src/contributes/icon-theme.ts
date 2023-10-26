import { ICON_THEME_NAME } from '@idl/shared';
import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve, sep } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

const ICON_THEMES = [
  {
    id: ICON_THEME_NAME,
    label: '%icons.label%',
    path: './extension/icon-theme/vs-seti-icon-theme.json',
  },
];

/**
 * Download's the VS Code theme files from github and makes changes for our extension
 */
async function DownloadFiles() {
  // specify folder and make it if it doesnt exist
  const outDir = join(process.cwd(), 'extension', 'icon-theme');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // base URL we are downloading from
  const baseUrl = `https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-seti/icons`;

  // specify the files to download
  const files = [
    'vs-seti-icon-theme.json',
    'seti.woff',
    'seti-circular-128x128.png',
  ];

  // download each file
  for (let i = 0; i < files.length; i++) {
    // get file as raw dat
    try {
      // specify the output file
      const outFile = outDir + sep + files[i];

      const resp = await axios.get(`${baseUrl}/${files[i]}`, {
        responseType: 'arraybuffer',
      });

      // write to disk
      writeFileSync(outFile, resp.data);
    } catch (err) {
      console.log(err);
    }
  }

  // process the output file
  const json = JSON.parse(
    readFileSync(outDir + sep + 'vs-seti-icon-theme.json', 'utf-8')
  );

  /** Dark icon */
  const darkIcon = './../images/dark/idlicon.svg';

  /** Resolve and make sure it exists */
  const qualifiedDark = resolve(outDir, outDir);
  if (!existsSync(qualifiedDark)) {
    throw new Error(`Dark icon theme file missing: "${qualifiedDark}"`);
  }

  /** Dark icon */
  const lightIcon = './../images/light/idlicon.svg';

  /** Resolve and make sure it exists */
  const qualifiedLight = resolve(outDir, outDir);
  if (!existsSync(qualifiedLight)) {
    throw new Error(`Light icon theme file missing: "${qualifiedLight}"`);
  }

  // add our icon definition for IDL
  json['iconDefinitions'] = {
    ...json['iconDefinitions'],
    _idl: {
      iconPath: darkIcon,
    },
    _idl_light: {
      iconPath: lightIcon,
    },
  };

  // update icon theme for IDL
  json['fileExtensions']['pro'] = '_idl';
  json['fileExtensions']['sav'] = '_idl';
  json['fileExtensions']['idllog'] = '_idl';
  json['fileExtensions']['idlnb'] = '_idl';
  json['light']['fileExtensions']['pro'] = '_idl_light';
  json['light']['fileExtensions']['sav'] = '_idl_light';
  json['light']['fileExtensions']['idllog'] = '_idl_light';
  json['light']['fileExtensions']['idlnb'] = '_idl_light';

  // save changes to disk
  writeFileSync(
    outDir + sep + 'vs-seti-icon-theme.json',
    JSON.stringify(json, null, 2) + '\n'
  );
}

/**
 * Updates the package.json file for our grammars which controls syntax highlighting
 */
export async function ProcessIconTheme(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // download aux files
  await DownloadFiles();

  // verify each theme
  for (let i = 0; i < ICON_THEMES.length; i++) {
    const icons = ICON_THEMES[i];

    // make sure that the theme file exists
    const url = join(process.cwd(), icons.path);
    if (!existsSync(url)) {
      throw new Error(
        `icon theme at index ${i} missing path file where expected "${icons.path}"`
      );
    }

    // verify label
    if (!VerifyNLS(icons.label, nls)) {
      throw new Error(
        `Config snippet at index ${i} has "body.name" missing from translation`
      );
    }
  }

  // made it here so lets update our package file
  contrib['iconThemes'] = ICON_THEMES;
}
