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
      element.innerText = `${JSON.stringify(data)}`;
      element.innerHTML = `<idl-nb-image></idl-nb-image>`;
    },
  };
};
