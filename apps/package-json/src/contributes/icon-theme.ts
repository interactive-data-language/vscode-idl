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
 * Extensions for IDL file types
 */
const IDL_EXTENSIONS = ['pro', 'sav', 'idllog', 'idlnb'];

/**
 * Extensions for ENVI file types
 */
const ENVI_EXTENSIONS = [
  'dat',
  'hdr',
  'enp',
  'evs',
  'ept',
  'model',
  'style',
  // 'shp',
  // 'tif',
  // 'tiff',
  // 'nitf',
  // 'ntf',
  // 'r0',
  // 'geojson',
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

  /** Dark IDL icon */
  const darkIconIDL = './../images/dark/idlicon-color.svg';

  /** Resolve and make sure it exists */
  const qualifiedDarkIDL = resolve(outDir, darkIconIDL);
  if (!existsSync(qualifiedDarkIDL)) {
    throw new Error(`Dark icon theme file missing: "${qualifiedDarkIDL}"`);
  }

  /** Light IDL icon */
  const lightIconIDL = './../images/light/idlicon-color.svg';

  /** Resolve and make sure it exists */
  const qualifiedLightIDL = resolve(outDir, lightIconIDL);
  if (!existsSync(qualifiedLightIDL)) {
    throw new Error(`Light icon theme file missing: "${qualifiedLightIDL}"`);
  }

  /** Dark ENVI icon */
  const darkIconENVI = './../images/dark/enviicon-color.svg';

  /** Resolve and make sure it exists */
  const qualifiedDarkENVI = resolve(outDir, darkIconENVI);
  if (!existsSync(qualifiedDarkENVI)) {
    throw new Error(`Dark icon theme file missing: "${qualifiedDarkENVI}"`);
  }

  /** Light ENVI icon */
  const lightIconENVI = './../images/light/enviicon-color.svg';

  /** Resolve and make sure it exists */
  const qualifiedLightENVI = resolve(outDir, lightIconENVI);
  if (!existsSync(qualifiedLightENVI)) {
    throw new Error(`Light icon theme file missing: "${qualifiedLightENVI}"`);
  }

  // add our icon definition for IDL
  json['iconDefinitions'] = {
    ...json['iconDefinitions'],
    _idl: {
      iconPath: darkIconIDL,
    },
    _idl_light: {
      iconPath: lightIconIDL,
    },
    _envi: {
      iconPath: darkIconENVI,
    },
    _envi_light: {
      iconPath: lightIconENVI,
    },
  };

  // add IDL extensions
  for (let i = 0; i < IDL_EXTENSIONS.length; i++) {
    json['fileExtensions'][IDL_EXTENSIONS[i]] = '_idl';
    json['light']['fileExtensions'][IDL_EXTENSIONS[i]] = '_idl_light';
  }

  // add ENVI extensions
  for (let i = 0; i < ENVI_EXTENSIONS.length; i++) {
    json['fileExtensions'][ENVI_EXTENSIONS[i]] = '_envi';
    json['light']['fileExtensions'][ENVI_EXTENSIONS[i]] = '_envi_light';
  }

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
