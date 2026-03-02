import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Simple test to verify test infrastructure works
 */
export const RunCopilotTestFollowsInstructions: RunnerFunction = async () => {
  console.log('Test 1');

  // Check what extensions are installed
  console.log('\nInstalled extensions:');
  const allExtensions = vscode.extensions.all;
  for (const ext of allExtensions) {
    if (ext.id.includes('copilot') || ext.id.includes('github')) {
      console.log(
        `  - ${ext.id}: active=${ext.isActive}, version=${ext.packageJSON.version}`
      );
    }
  }

  // Check for GitHub Copilot Chat specifically
  const copilotExt = vscode.extensions.getExtension('GitHub.copilot-chat');
  if (copilotExt) {
    console.log('\nGitHub Copilot Chat found!');
    if (!copilotExt.isActive) {
      console.log('Activating GitHub Copilot Chat...');
      await copilotExt.activate();
    }
  } else {
    console.log('\nGitHub Copilot Chat extension NOT found');
  }

  // Try to find any available language models
  const allModels = await vscode.lm.selectChatModels();
  console.log(`\nFound ${allModels.length} total language models`);

  for (const model of allModels) {
    console.log(
      `  - Model: ${model.id}, Vendor: ${model.vendor}, Family: ${model.family}`
    );
  }

  // Try specifically for Copilot
  const copilotModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });
  console.log(`Found ${copilotModels.length} Copilot models`);

  if (copilotModels.length === 0) {
    console.log('No Copilot models available. Skipping test.');
    return; // Skip test instead of failing
  }

  const model = copilotModels[0];

  const propmpt = 'Hello?';
  console.log('Prompt: ' + propmpt);

  const messages = [vscode.LanguageModelChatMessage.User(propmpt)];

  const response = await model.sendRequest(
    messages,
    {}, // options (can include temperature, etc.)
    new vscode.CancellationTokenSource().token
  );

  let fullResponse = '';
  for await (const part of response.text) {
    fullResponse += part;
  }

  if (!fullResponse) {
    throw new Error('Expected response but got empty string');
  }

  console.log('Response: ' + fullResponse);
};

// code found online.
// import * as vscode from "vscode";

// export function activate(context: vscode.ExtensionContext) {
//   context.subscriptions.push(
//     vscode.commands.registerCommand("idlHarness.llmString", async (input: string) => {
//       if (typeof input !== "string") {
//         throw new Error("idlHarness.llmString expects a single string argument");
//       }

//       // Pick any Copilot-provided chat model available to the user
//       const models = await vscode.lm.selectChatModels({ vendor: "copilot" });
//       if (!models.length) {
//         throw new Error("No Copilot chat models available (is Copilot installed + signed in?)");
//       }
//       const model = models[0];

//       const messages = [
//         vscode.LanguageModelChatMessage.User(input)
//       ];

//       // Send request
//       const res = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

//       // Collect streamed text parts into a single string
//       let out = "";
//       for await (const part of res.text) {
//         out += part;
//       }
//       return out;
//     })
//   );
// }
