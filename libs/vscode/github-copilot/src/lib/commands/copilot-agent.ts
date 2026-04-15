import * as vscode from 'vscode';

import { readInstructions } from '../helpers/synch-additional-instructions';

/** Max rounds of tool-calling before stopping */
const MAX_TOOL_ROUNDS = 20;

/** Options for an agent request */
interface AgentRequestOptions {
  /** Include .instructions.md as context */
  includeInstructions?: boolean;
  /** Include MCP/registered tools */
  includeTools?: boolean;
  /** User prompt */
  prompt: string;
}

/** Result from an agent request */
export interface AgentResult {
  /** Final text response */
  text: string;
  /** Tool calls that were made */
  toolCalls: { name: string; input: object }[];
}

/**
 * Encapsulates the vscode.lm agent loop with optional
 * instructions injection and MCP tool-calling support.
 */
export class SimulatedCopilotChatAgent {
  /** The underlying model id */
  get modelId(): string {
    return this.model.id;
  }

  private model: vscode.LanguageModelChat;

  constructor(model: vscode.LanguageModelChat) {
    this.model = model;
  }

  /**
   * Selects the first available Copilot model (usually the "best"), or throws.
   */
  static async create(): Promise<SimulatedCopilotChatAgent> {
    const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });

    if (models.length === 0) {
      throw new Error(
        'No Copilot models found. Make sure you are signed into GitHub Copilot.',
      );
    }

    // prefer Claude Sonnet 4.5, fall back to first available
    const preferred = models.find((m) =>
      m.id.toLowerCase().includes('claude-sonnet-4.5'),
    );

    return new SimulatedCopilotChatAgent(preferred ?? models[0]);
  }

  /**
   * Send a prompt with an agent loop that handles tool calls.
   */
  async sendtoSimulation(options: AgentRequestOptions): Promise<AgentResult> {
    const messages: vscode.LanguageModelChatMessage[] = [];

    // inject instructions as system context
    if (options.includeInstructions) {
      const instructions = await readInstructions();
      if (instructions) {
        messages.push(vscode.LanguageModelChatMessage.User(instructions));
      }
    }

    messages.push(vscode.LanguageModelChatMessage.User(options.prompt));

    // gather registered tools (includes MCP tools)
    const tools: vscode.LanguageModelChatTool[] = options.includeTools
      ? vscode.lm.tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        }))
      : [];

    const requestOptions: vscode.LanguageModelChatRequestOptions =
      tools.length > 0 ? { tools } : {};

    let finalText = '';
    if (options.includeTools && tools.length <= 0) {
      finalText +=
        '\n\n[WARNING] No tools available when tools are requested. Agent will not be able to make tool calls.';
    }

    const allToolCalls: { name: string; input: object }[] = [];

    let round = 0;

    for (round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const token = new vscode.CancellationTokenSource().token;
      const response = await this.model.sendRequest(
        messages,
        requestOptions,
        token,
      );

      const toolCallsThisRound: vscode.LanguageModelToolCallPart[] = [];
      const textParts: string[] = [];

      for await (const part of response.stream) {
        if (part instanceof vscode.LanguageModelTextPart) {
          textParts.push(part.value);
        } else if (part instanceof vscode.LanguageModelToolCallPart) {
          toolCallsThisRound.push(part);
          allToolCalls.push({ name: part.name, input: part.input });
        }
      }

      const roundText = textParts.join('');

      // keep the latest non-empty text from the model.
      // this is what we report.
      if (roundText.length > 0) {
        finalText = roundText;
      }

      // no tool calls — we're done
      if (toolCallsThisRound.length === 0) {
        break;
      }

      // execute each tool call and feed results back
      for (const toolCall of toolCallsThisRound) {
        const result = await vscode.lm.invokeTool(
          toolCall.name,
          { toolInvocationToken: undefined, input: toolCall.input },
          token,
        );

        messages.push(
          vscode.LanguageModelChatMessage.Assistant([toolCall]),
          vscode.LanguageModelChatMessage.User([
            new vscode.LanguageModelToolResultPart(
              toolCall.callId,
              result.content,
            ),
          ]),
        );
      }
    }

    if (round === MAX_TOOL_ROUNDS) {
      finalText +=
        '\n\n[WARNING] Stopped after reaching max tool rounds. Answer may be incomplete.';
    }

    return { text: finalText, toolCalls: allToolCalls };
  }
}
