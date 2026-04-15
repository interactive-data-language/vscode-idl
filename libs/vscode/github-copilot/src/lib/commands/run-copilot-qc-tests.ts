import { IDL_COMMANDS } from '@idl/shared/extension';
import { IRunIDLCommandResult } from '@idl/types/vscode-debug';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { SimulatedCopilotChatAgent } from './copilot-agent';
import { QC_CODE_TESTS, QC_SETUP_TESTS, QC_TESTS } from './qc-test-definitions';

/** Directory name (relative to workspace root) for generated test code */
export const TestCodeDirectory = 'tmp';

/**
 * Context passed to each QC test function
 */
export interface QCTestContext {
  agent: SimulatedCopilotChatAgent;
  output: vscode.OutputChannel;
  withTools: boolean;
}

/**
 * A single QC test: an async function that returns true if it passed.
 */
export interface QCTest {
  name: string;
  run: (ctx: QCTestContext) => Promise<boolean>;
  /** If true, this test is skipped during the baseline (no tools) run */
  skipBaseline?: boolean;
}

/**
 * Extract the first fenced code block (``` or ```idl) from a response,
 * If the AI doesnt play nice then just use the whole response as code.
 */

export function extractCodeBlock(text: string): string {
  const match = text.match(/```(?:idl)?\s*\n([\s\S]*?)```/i);
  return (match ? match[1] : text).trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Compare the return values of two IDL functions using ARRAY_EQUAL.
 * Writes a wrapper .pro that prints the comparison result, runs it,
 * and returns true if the output contains "1".
 */

export async function compareIDLFunctions(
  funcA: string,
  funcB: string,
  output: vscode.OutputChannel,
): Promise<boolean> {
  const started = await StartIDL();
  if (!started.started) {
    output.appendLine('  Could not start IDL for comparison');
    return false;
  }

  try {
    await IDL_DEBUG_ADAPTER.evaluate('message, /reset & retall');
    await IDL_DEBUG_ADAPTER.resetMain();

    // compile both functions into the same session
    await IDL_DEBUG_ADAPTER.evaluate(`CD, '${TestCodeDirectory}'`);
    await IDL_DEBUG_ADAPTER.evaluate(`.compile -v '${funcA}'`);
    await IDL_DEBUG_ADAPTER.evaluate(`.compile -v '${funcB}'`);

    // compare return values directly
    const result = await IDL_DEBUG_ADAPTER.evaluate(
      `print, array_equal(${funcA}(), ${funcB}())`,
    );

    return result?.trim().includes('1') ?? false;
  } finally {
    await sleep(1000);
    IDL_DEBUG_ADAPTER.terminate();
    await sleep(1000);
    output.show(true);
  }
}

/**
 * Start IDL, open a .pro file, run it, and stop IDL.
 * Returns the IRunIDLCommandResult or null if IDL couldn't start.
 */
export async function runIDLFile(
  filePath: string,
  output: vscode.OutputChannel,
): Promise<IRunIDLCommandResult | null> {
  const started = await StartIDL();
  if (!started.started) {
    return null;
  }

  try {
    await IDL_DEBUG_ADAPTER.evaluate('message, /reset & retall');
    await IDL_DEBUG_ADAPTER.resetMain();
    await OpenFileInVSCode(filePath, true);

    return await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RUN);
  } finally {
    await sleep(1000);
    IDL_DEBUG_ADAPTER.terminate();
    await sleep(1000);
    output.show(true);
  }
}

/**
 * Runs a suite of QC tests and returns the score.
 */
async function runTestSuite(
  label: string,
  tests: QCTest[],
  ctx: QCTestContext,
): Promise<{ score: number; total: number; failed: string[] }> {
  const { output } = ctx;
  output.appendLine(`----- ${label} -----`);
  output.appendLine('');

  let score = 0;
  let total = 0;
  const failed: string[] = [];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const num = i + 1;

    if (test.skipBaseline && !ctx.withTools) {
      output.appendLine(`[${num}] ${test.name}... SKIPPED (baseline)`);
      output.appendLine('');
      continue;
    }

    total++;
    output.appendLine(`[${num}] ${test.name}...`);

    try {
      const passed = await test.run(ctx);
      score += passed ? 1 : 0;
      if (!passed) failed.push(test.name);
      output.appendLine(passed ? '  PASSED' : '  FAILED');
    } catch (err) {
      failed.push(test.name);
      output.appendLine(`  FAILED: ${err}`);
    }

    output.appendLine('');
  }

  return { score, total, failed };
}

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

  let agent: SimulatedCopilotChatAgent;
  try {
    agent = await SimulatedCopilotChatAgent.create();
  } catch (err) {
    output.appendLine(`ERROR: ${err}`);
    return;
  }

  output.appendLine(`Using model: ${agent.modelId}`);
  output.appendLine(
    `Registered tools: ${vscode.lm.tools.length} ` +
      `(${vscode.lm.tools.map((t) => t.name).join(', ')})`,
  );
  output.appendLine('You may need to click "Allow" to proceed.');
  output.appendLine(' THESE WILL TAKE A WHILE TO RUN... ');
  output.appendLine('');

  // vscode.lm is a raw LLM API — it doesn't automatically include
  // .instructions.md files or MCP tools like Copilot Chat does.
  // SimulatedCopilotChatAgent manually injects instructions and provides tools
  // to simulate the full Copilot Chat experience programmatically.

  const ctx: QCTestContext = { agent, output, withTools: true };

  // ── Setup tests (run once, full only) ──
  const setup = await runTestSuite('Setup Tests', QC_SETUP_TESTS, ctx);

  // ── Full run (with instructions + tools) ──
  const fullKnowledge = await runTestSuite(
    'Full: Knowledge Tests',
    QC_TESTS,
    ctx,
  );
  const fullCode = await runTestSuite('Full: Code Tests', QC_CODE_TESTS, ctx);

  // ── Baseline run (no instructions/tools) ──
  const baselineCtx = { ...ctx, withTools: false };
  const baselineKnowledge = await runTestSuite(
    'Baseline: Knowledge Tests',
    QC_TESTS,
    baselineCtx,
  );
  const baselineCode = await runTestSuite(
    'Baseline: Code Tests',
    QC_CODE_TESTS,
    baselineCtx,
  );

  // ── Code-only scores ──
  const codeFullPct =
    fullCode.total > 0 ? (fullCode.score / fullCode.total) * 100 : 0;
  const codeBaselinePct =
    baselineCode.total > 0
      ? (baselineCode.score / baselineCode.total) * 100
      : 0;
  const codeImprovement =
    codeBaselinePct > 0
      ? ((codeFullPct - codeBaselinePct) / codeBaselinePct) * 100
      : 0;

  // ── Code + Knowledge scores ──
  const allFullScore = fullCode.score + fullKnowledge.score;
  const allFullTotal = fullCode.total + fullKnowledge.total;
  const allBaselineScore = baselineCode.score + baselineKnowledge.score;
  const allBaselineTotal = baselineCode.total + baselineKnowledge.total;
  const allFullPct = allFullTotal > 0 ? (allFullScore / allFullTotal) * 100 : 0;
  const allBaselinePct =
    allBaselineTotal > 0 ? (allBaselineScore / allBaselineTotal) * 100 : 0;
  const allImprovement =
    allBaselinePct > 0
      ? ((allFullPct - allBaselinePct) / allBaselinePct) * 100
      : 0;

  const fullFailed = [
    ...setup.failed,
    ...fullKnowledge.failed,
    ...fullCode.failed,
  ];
  const baselineFailed = [...baselineKnowledge.failed, ...baselineCode.failed];

  output.appendLine('=========================================');
  output.appendLine('  Code Results');
  output.appendLine('=========================================');
  output.appendLine(
    `  Full:     ${fullCode.score}/${fullCode.total}  ${codeFullPct.toFixed(1)}%`,
  );
  output.appendLine(
    `  Baseline: ${baselineCode.score}/${baselineCode.total}  ${codeBaselinePct.toFixed(1)}%`,
  );
  output.appendLine(
    `  Improvement: ${codeImprovement >= 0 ? '+' : ''}${codeImprovement.toFixed(1)}%`,
  );

  output.appendLine('');
  output.appendLine('=========================================');
  output.appendLine('  Code + Knowledge Results');
  output.appendLine('=========================================');
  output.appendLine(
    `  Full:     ${allFullScore}/${allFullTotal}  ${allFullPct.toFixed(1)}%`,
  );
  output.appendLine(
    `  Baseline: ${allBaselineScore}/${allBaselineTotal}  ${allBaselinePct.toFixed(1)}%`,
  );
  output.appendLine(
    `  Improvement: ${allImprovement >= 0 ? '+' : ''}${allImprovement.toFixed(1)}%`,
  );
  output.appendLine('=========================================');

  if (fullFailed.length > 0) {
    output.appendLine('');
    output.appendLine('Failed (Full):');
    output.appendLine(fullFailed.map((n) => `  - ${n}`).join('\n'));
  }

  if (baselineFailed.length > 0) {
    output.appendLine('');
    output.appendLine('Failed (Baseline):');
    output.appendLine(baselineFailed.map((n) => `  - ${n}`).join('\n'));
  }

  output.appendLine('');
  output.appendLine('-----------------------------------------');
  output.appendLine(
    '  At time of writing the test infrastructure we had an average of:',
  );
  output.appendLine(
    '    Code:             Full 82.7%  Baseline 61.5%  Improvement +34.4%',
  );
  output.appendLine(
    '    Code + Knowledge: Full 81.8%  Baseline 69.7%  Improvement +17.6%',
  );
  output.appendLine('-----------------------------------------');
}

// =========================================
//   Code Results
// =========================================
//   Full:     11/13  84.6%
//   Baseline: 8/13  61.5%
//   Improvement: +37.5%

// =========================================
//   Code + Knowledge Results
// =========================================
//   Full:     27/33  81.8%
//   Baseline: 24/33  72.7%
//   Improvement: +12.5%
// =========================================

// Failed (Full):
//   - Q6: Integer loop overflow
//   - Q12: TOTAL dimension keyword
//   - Q13: FLTARR trailing dimensions
//   - Q16: CONVOL edge handling
//   - Code 3: Safe WHERE pattern
//   - Code 10: Cumulative distribution with TOTAL

// Failed (Baseline):
//   - Q1: REBIN expansion edge behavior
//   - Q6: Integer loop overflow
//   - Q12: TOTAL dimension keyword
//   - Q16: CONVOL edge handling
//   - Code 0: Purposefully fail to test error handling
//   - Code 2: Neighborhood average downsample
//   - Code 6: Type-safe large array accumulation
//   - Code 10: Cumulative distribution with TOTAL
//   - Code 11: Masked median filter

// =========================================
//   Code Results
// =========================================
//   Full:     10/13  76.9%
//   Baseline: 8/13  61.5%
//   Improvement: +25.0%

// =========================================
//   Code + Knowledge Results
// =========================================
//   Full:     24/33  72.7%
//   Baseline: 23/33  69.7%
//   Improvement: +4.3%
// =========================================

// Failed (Full):
//   - Q1: REBIN expansion edge behavior
//   - Q6: Integer loop overflow
//   - Q12: TOTAL dimension keyword
//   - Q13: FLTARR trailing dimensions
//   - Q14: INDGEN dimension order
//   - Q18: String concatenation with +
//   - Code 2: Neighborhood average downsample
//   - Code 3: Safe WHERE pattern
//   - Code 10: Cumulative distribution with TOTAL

// Failed (Baseline):
//   - Q1: REBIN expansion edge behavior
//   - Q6: Integer loop overflow
//   - Q7: Matrix multiply # vs ##
//   - Q12: TOTAL dimension keyword
//   - Q16: CONVOL edge handling
//   - Code 0: Purposefully fail to test error handling
//   - Code 2: Neighborhood average downsample
//   - Code 6: Type-safe large array accumulation
//   - Code 10: Cumulative distribution with TOTAL
//   - Code 11: Masked median filter

// =========================================
//   Code Results
// =========================================
//   Full:     10/13  76.9%
//   Baseline: 8/13  61.5%
//   Improvement: +25.0%

// =========================================
//   Code + Knowledge Results
// =========================================
//   Full:     28/33  84.8%
//   Baseline: 23/33  69.7%
//   Improvement: +21.7%
// =========================================

// Failed (Full):
//   - Q6: Integer loop overflow
//   - Q18: String concatenation with +
//   - Code 3: Safe WHERE pattern
//   - Code 6: Type-safe large array accumulation
//   - Code 10: Cumulative distribution with TOTAL

// Failed (Baseline):
//   - Q1: REBIN expansion edge behavior
//   - Q6: Integer loop overflow
//   - Q7: Matrix multiply # vs ##
//   - Q12: TOTAL dimension keyword
//   - Q16: CONVOL edge handling
//   - Code 0: Purposefully fail to test error handling
//   - Code 2: Neighborhood average downsample
//   - Code 6: Type-safe large array accumulation
//   - Code 10: Cumulative distribution with TOTAL
//   - Code 11: Masked median filter

// =========================================
//   Code Results
// =========================================
//   Full:     12/13  92.3%
//   Baseline: 8/13  61.5%
//   Improvement: +50.0%

// =========================================
//   Code + Knowledge Results
// =========================================
//   Full:     29/33  87.9%
//   Baseline: 22/33  66.7%
//   Improvement: +31.8%
// =========================================

// Failed (Full):
//   - Q6: Integer loop overflow
//   - Q12: TOTAL dimension keyword
//   - Q13: FLTARR trailing dimensions
//   - Code 2: Neighborhood average downsample

// Failed (Baseline):
//   - Q1: REBIN expansion edge behavior
//   - Q6: Integer loop overflow
//   - Q7: Matrix multiply # vs ##
//   - Q12: TOTAL dimension keyword
//   - Q16: CONVOL edge handling
//   - Q17: REBIN compression averaging
//   - Code 0: Purposefully fail to test error handling
//   - Code 2: Neighborhood average downsample
//   - Code 6: Type-safe large array accumulation
//   - Code 10: Cumulative distribution with TOTAL
//   - Code 11: Masked median filter
