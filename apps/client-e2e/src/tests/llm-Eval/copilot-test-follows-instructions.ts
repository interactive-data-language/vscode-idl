import { RunnerFunction } from '../runner.interface';

/**
 * Simple test to verify test infrastructure works
 */
export const RunCopilotTestFollowsInstructions: RunnerFunction = async () => {
  console.log('Debug: Copilot follow instructions test running');
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
