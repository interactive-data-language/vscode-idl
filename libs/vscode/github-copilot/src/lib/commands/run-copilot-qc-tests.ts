import * as vscode from 'vscode';

/**
 * Runs the Copilot QC test suite.
 *
 * Only available in Extension Development Host (dev mode).
 */
export async function RunCopilotQCTests() {
  const output = vscode.window.createOutputChannel('IDL: Copilot QC Tests');
  output.clear();
  output.show(true);

  output.appendLine('=========================================');
  output.appendLine('  Copilot QC Tests');
  output.appendLine('=========================================');
  output.appendLine('');

  // find a Copilot model
  const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });

  if (models.length === 0) {
    output.appendLine('ERROR: No Copilot models found.');
    output.appendLine('Make sure you are signed into GitHub Copilot.');
    return;
  }

  const model = models[0];
  output.appendLine(`Using model: ${model.id}`);
  output.appendLine('You may need to click "Allow" to proceed.');
  output.appendLine('');

  // basic hello test
  try {
    output.appendLine('[1] Copilot responds to basic prompt...');
    const prompt = 'Say "hello" and nothing else';
    output.appendLine(`Prompt: ${prompt}`);
    const messages = [
      vscode.LanguageModelChatMessage.User(prompt),
    ];
    const response = await model.sendRequest(
      messages,
      {},
      new vscode.CancellationTokenSource().token
    );

    let text = '';
    for await (const part of response.text) {
      text += part;
    }

    output.appendLine(`  Response: ${text}`);
    output.appendLine(text.length > 0 ? '  PASSED' : '  FAILED');
  } catch (err) {
    output.appendLine(`  FAILED: ${err}`);
  }

  // TODO: add more QC tests here
}
