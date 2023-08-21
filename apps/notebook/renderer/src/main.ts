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

      // save ID for cell output item
      (window as any)._vscodeCellOutputMetadata = data.metadata;

      // create key for data for better data transfer
      const dataKey = `${Math.floor(Date.now() * 1000)}`;

      // save in window
      (window as any)[dataKey] = data.json();

      // set HTML and pass in our data key
      element.innerHTML = `<idl-nb-entry data='${dataKey}'></idl-nb-entry>`;
    },
  };
};
