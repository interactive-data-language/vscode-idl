import { LANGUAGES } from '@idl/translation';
import * as fs from 'fs';
import * as path from 'path';

// helper that will flatten our object and preserve the path for vscode
// orginally from https://stackoverflow.com/a/33158929
function flattenWithPath(obj, objectPath = '') {
  // init result
  const flat = {};

  // process our key
  Object.keys(obj).forEach((key) => {
    // recurse if object
    if (typeof obj[key] === 'object') {
      Object.assign(
        flat,
        flattenWithPath(obj[key], objectPath ? `${objectPath}.${key}` : key)
      );
    } else {
      flat[objectPath ? `${objectPath}.${key}` : key] = obj[key];
    }
  });

  return flat;
}

function main() {
  // get the extension direactory
  const extDir = path.dirname(path.dirname(path.dirname(__dirname)));

  // process all of our loaded languages
  Object.keys(LANGUAGES).forEach((language) => {
    // specify the easy output file for the vscode translation and write to disk
    const outdir = path.join(process.cwd(), 'dist', 'i18n');

    // make output folder if it doesnt exist
    if (!fs.existsSync(outdir)) {
      fs.mkdirSync(outdir);
    }

    // specify the output file for the vscode translation and write to disk
    let outFile: string;

    // default language of english
    if (language === 'en') {
      outFile = `${extDir}${path.sep}package.nls.json`;
    } else {
      outFile = `${extDir}${path.sep}package.nls.${language}.json`;
    }

    // write our flattened text
    fs.writeFileSync(
      outFile,
      JSON.stringify(flattenWithPath(LANGUAGES[language])),
      {
        encoding: 'utf8',
      }
    );

    // specify the translation file for our extension that is easy to use and user proof
    const easyOutFile = `${outdir}${path.sep}${language}.json`;
    fs.writeFileSync(easyOutFile, JSON.stringify(LANGUAGES[language]), {
      encoding: 'utf8',
    });
  });
}

main();
