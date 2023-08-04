import type { ActivationFunction } from 'vscode-notebook-renderer';

export const activate: ActivationFunction = (context) => {
  return {
    renderOutputItem(data, element) {
      element.innerText = `${JSON.stringify(data)}`;
    },
  };
};
