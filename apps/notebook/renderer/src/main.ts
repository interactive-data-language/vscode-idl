/* eslint-disable @nx/enforce-module-boundaries */

/**
 * Import paths for the web components that we create
 *
 * All content should be raw JS that we can import with styles embedded within
 * the components themselves
 */
import './../../components/runtime.js';
import './../../components/polyfills.js';
import './../../components/main.js';

import type { ActivationFunction } from 'vscode-notebook-renderer';

export const activate: ActivationFunction = (context) => {
  return {
    renderOutputItem(data, element) {
      // save context
      (window as any)._vscodeContext = context;

      // this is a blob ref i think: JSON.stringify(data)
      element.innerHTML = `<idl-nb-entry data='${data.text()}'></idl-nb-entry>`;
      // element.innerText = `${data.text()}`;
    },
  };
};
