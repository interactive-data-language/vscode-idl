import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import * as vscode from 'vscode';

import {
  compareIDLFunctions,
  extractCodeBlock,
  QCTest,
  runIDLFile,
  TestCodeDirectory,
} from './run-copilot-qc-tests';

/** Setup tests: connectivity, instructions, and tools */
export const QC_SETUP_TESTS: QCTest[] = [
  {
    name: 'Deletes tmp file before running',
    run: async ({ agent, output }) => {
      agent = null; // not using agent.

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return true; // not a failure if we can't find a folder to delete from
      }
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      if (!outDir) {
        output.appendLine('  No tmp directory found');
        return true; // not a failure if we can't find a tmp directory
      }

      // if it exist then delete it and its content
      try {
        await vscode.workspace.fs.delete(vscode.Uri.file(outDir), {
          recursive: true,
        });
        output.appendLine('  Deleted existing tmp directory');
        return true;
      } catch (err) {
        output.appendLine(`  Something went wrong deleting tmp. ${err}`);
        return false;
      }
    },
  },
  {
    name: 'Copilot responds to basic prompt',
    run: async ({ agent, output }) => {
      const result = await agent.sendtoSimulation({
        prompt: 'Say "hello" and nothing else.',
      });
      output.appendLine(`  Response: ${result.text}`);
      return result.text.toLowerCase().includes('hello');
    },
  },
  {
    name: 'Copilot follows injected instructions',
    skipBaseline: true,
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'What should you say before every message? Only say the keywords.',
        includeInstructions: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      return result.text.toLowerCase().includes('idl agent');
    },
  },
  {
    name: 'Copilot can see registered tools',
    skipBaseline: true,
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'List the names of any tools you have access to. ' +
          'Just list the tool names, one per line.',
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      return vscode.lm.tools.length > 0;
    },
  },
  {
    name: 'Copilot can call a tool',
    skipBaseline: true,
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'Use the "list-all-resources" tool to list available resources. ' +
          'Report what you find.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      for (const tc of result.toolCalls) {
        output.appendLine(
          `  Tool call: ${tc.name}(${JSON.stringify(tc.input)})`,
        );
      }
      return result.toolCalls.some((tc) =>
        tc.name.includes('list-all-resources'),
      );
    },
  },
];

/** IDL Knowledge Tests */
export const QC_TESTS: QCTest[] = [
  // ── IDL Knowledge Tests ──────────────────────────────────────────────
  {
    name: 'Q1: REBIN expansion edge behavior',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does the following code print?\n\n' +
          '```idl\n' +
          'a = [0, 10, 20, 30]\n' +
          'b = REBIN(a, 12)\n' +
          'PRINT, b\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const expected = [0, 3, 6, 10, 13, 16, 20, 23, 26, 30, 30, 30];
      const passed = expected.every((v) => answer.includes(String(v)));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q2: REBIN dimension constraint',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, will the following code work? If not, why?\n\n' +
          '```idl\n' +
          'a = FINDGEN(10)\n' +
          'b = REBIN(a, 7)\n' +
          '```\n\n' +
          'Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const mentionsError =
        lower.includes('error') ||
        lower.includes('not') ||
        lower.includes('fail') ||
        lower.includes('cannot');
      const mentionsFactor =
        lower.includes('factor') ||
        lower.includes('multiple') ||
        lower.includes('evenly');
      const passed = mentionsError && mentionsFactor;
      return passed;
    },
  },
  {
    name: 'Q3: CONVOL correlation vs convolution',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          "IDL's CONVOL function computes correlation by default, not convolution. " +
          'True or false? Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const passed =
        lower.includes('true') &&
        (lower.includes('not reverse') ||
          lower.includes('does not reverse') ||
          lower.includes('no reverse') ||
          lower.includes('correlation') ||
          lower.includes("doesn't reverse") ||
          lower.includes('not flip'));
      return passed;
    },
  },
  {
    name: 'Q4: CONVOL CENTER keyword',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what is the difference between these two calls?\n\n' +
          '```idl\n' +
          'result1 = CONVOL(data, kernel)\n' +
          'result2 = CONVOL(data, kernel, CENTER=0)\n' +
          '```\n\n' +
          'Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const passed =
        lower.includes('center') &&
        (lower.includes('align') ||
          lower.includes('offset') ||
          lower.includes('shift') ||
          lower.includes('kernel[0]') ||
          lower.includes('middle'));
      return passed;
    },
  },
  {
    name: 'Q5: Array indexing inclusive ranges',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, how many elements does this return?\n\n' +
          '```idl\n' +
          'a = FINDGEN(10)\n' +
          'b = a[3:7]\n' +
          'PRINT, N_ELEMENTS(b)\n' +
          '```\n\n' +
          'Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const passed = answer.includes('5');
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q6: Integer loop overflow',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, why does this loop never finish?\n\n' +
          '```idl\n' +
          'for i = 0, 100000 do j = i\n' +
          '```\n\n' +
          'Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const mentionsOverflow =
        lower.includes('overflow') ||
        lower.includes('16-bit') ||
        lower.includes('32767') ||
        lower.includes('int') ||
        lower.includes('wraps');
      const mentionsFix =
        lower.includes('0l') ||
        lower.includes('long') ||
        lower.includes('compile_opt');
      const passed = mentionsOverflow && mentionsFix;
      return passed;
    },
  },
  {
    name: 'Q7: Matrix multiply # vs ##',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, given:\n\n' +
          '```idl\n' +
          'a = INDGEN(2, 3)\n' +
          'b = INDGEN(3, 2)\n' +
          '```\n\n' +
          'What are the dimensions of `a # b` and `a ## b`? ' +
          'Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const hasHashDims =
        lower.includes('2, 2') ||
        lower.includes('2,2') ||
        lower.includes('2 2');
      const hasDoubleHashDims =
        lower.includes('3, 3') ||
        lower.includes('3,3') ||
        lower.includes('3 3');
      const passed = hasHashDims && hasDoubleHashDims;
      return passed;
    },
  },
  {
    name: 'Q8: < and > are min/max operators',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = 5\n' +
          'b = 3\n' +
          'PRINT, a < b\n' +
          'PRINT, a > b\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const lines = answer
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const passed =
        lines.some((l) => l.includes('3')) &&
        lines.some((l) => l.includes('5'));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q9: WHERE returns -1 on no match',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = [1, 2, 3, 4, 5]\n' +
          'idx = WHERE(a GT 10, count)\n' +
          'PRINT, count\n' +
          'PRINT, idx\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const hasZero = answer.includes('0');
      const hasMinus1 = answer.includes('-1');
      const passed = hasZero && hasMinus1;
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q10: HISTOGRAM REVERSE_INDICES',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, given this code:\n\n' +
          '```idl\n' +
          'data = RANDOMU(seed, 100) * 100\n' +
          'h = HISTOGRAM(data, BINSIZE=25, REVERSE_INDICES=ri)\n' +
          '```\n\n' +
          'How do you extract the indices of elements that fell into bin i? ' +
          'Put your answer in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text).toLowerCase();
      const passed =
        answer.includes('ri[ri[i]') ||
        answer.includes('ri[ri[i]') ||
        (answer.includes('ri[') && answer.includes('ri[i+1]-1'));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q11: REFORM column-major order',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = INDGEN(12)\n' +
          'b = REFORM(a, 3, 4)\n' +
          'PRINT, b[1, 2]\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text).trim();
      const passed = answer.includes('7');
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q12: TOTAL dimension keyword',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what are the dimensions of b?\n\n' +
          '```idl\n' +
          'a = FINDGEN(3, 4, 5)\n' +
          'b = TOTAL(a, 2)\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const passed =
        lower.includes('3') &&
        lower.includes('5') &&
        !lower.includes('3, 4') &&
        !lower.includes('4, 5');
      return passed;
    },
  },
  {
    name: 'Q13: FLTARR trailing dimensions',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = FLTARR(5, 1)\n' +
          'b = FLTARR(5)\n' +
          'PRINT, SIZE(a, /N_DIMENSIONS)\n' +
          'PRINT, SIZE(b, /N_DIMENSIONS)\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const passed = answer.includes('2') && answer.includes('1');
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q14: INDGEN dimension order',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = INDGEN(3, 2)\n' +
          'PRINT, a\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const lines = answer
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const passed =
        lines.some((l) => /0\s+1\s+2/.test(l)) &&
        lines.some((l) => /3\s+4\s+5/.test(l));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q15: Float index truncation',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = INDGEN(5)\n' +
          'PRINT, a[1.9]\n' +
          'PRINT, a[2.1]\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const lines = answer
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const passed =
        lines.length >= 2 && lines[0].includes('1') && lines[1].includes('2');
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q16: CONVOL edge handling',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this return?\n\n' +
          '```idl\n' +
          'result = CONVOL([1,2,3,4,5], [1,1,1])\n' +
          'PRINT, result\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const expected = [0, 6, 9, 12, 0];
      const passed = expected.every((v) => answer.includes(String(v)));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q17: REBIN compression averaging',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = [2, 4, 6, 8, 10, 12]\n' +
          'b = REBIN(a, 3)\n' +
          'PRINT, b\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const expected = [3, 7, 11];
      const passed = expected.every((v) => answer.includes(String(v)));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q18: String concatenation with +',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          "a = '10'\n" +
          "b = '20'\n" +
          'PRINT, a + b\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const passed = answer.includes('1020');
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q19: SIZE function return value',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print?\n\n' +
          '```idl\n' +
          'a = FLTARR(3, 4)\n' +
          's = SIZE(a)\n' +
          'PRINT, s\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const answer = extractCodeBlock(result.text);
      const expected = [2, 3, 4, 4, 12];
      const passed = expected.every((v) => answer.includes(String(v)));
      output.appendLine(`  Extracted: ${answer}`);
      return passed;
    },
  },
  {
    name: 'Q20: BYTE type overflow',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, what does this print and what type is the result?\n\n' +
          '```idl\n' +
          'a = BYTE(200)\n' +
          'b = BYTE(100)\n' +
          'PRINT, a + b\n' +
          '```\n\n' +
          'Put the printed output in an IDL code block and state the type.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();
      const has300 = lower.includes('300');
      const hasInt = lower.includes('int');
      const passed = has300 && hasInt;
      return passed;
    },
  },
];

// ── Code Tests ───────────────────────────────────────────────────────
export const QC_CODE_TESTS: QCTest[] = [
  {
    name: 'Code 0: Purposefully fail to test error handling',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'Write IDL code that creates a 3D surface plot of z = sin(x) * cos(y). ' +
          ' Add a syntax error. Only output the function called qc_syntax_error, ' +
          'any explanations should be comments.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      if (!lower.includes('surface(') || lower.includes('obj_new(')) {
        output.appendLine('  Code validation failed');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_syntax_error.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return false; // we expected this to fail!
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return true; // we expected this to fail, so it's a pass!
      }
    },
  },
  {
    name: 'Code 1: IDL 3D surface plot',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'Write IDL code that creates a 3D surface plot of z = sin(x) * cos(y). ' +
          'Use function graphics. Only output the function called qc_surface_plot, ' +
          'any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      if (!lower.includes('surface(') || lower.includes('obj_new(')) {
        output.appendLine('  Code validation failed');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_surface_plot.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      // A surface plot keeps IDL paused (graphics window open), so
      // runResult.success may be false even though the code ran fine.
      // We treat any non-crash as a pass.
      if (runResult.idlOutput) {
        output.appendLine(`  IDL output: ${runResult.idlOutput}`);
      }
      return true;
    },
  },
  {
    name: 'Code 1b: IDL Math test (VALUE_LOCATE)',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, you have irregularly spaced classification breakpoints: [0.0, 0.15, 0.4, ' +
          '0.75, 1.0]. Given a million random floats (generated with a seed of 1L) between 0 and 1, assign each one ' +
          'to its bin index. The function takes no parameters — define all data inside the function body. ' +
          'This should be production level code. Only output the function called qc_math_test, ' +
          'any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      if (!lower.includes('value_locate(') || lower.includes('obj_new(')) {
        output.appendLine('  Code validation failed');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      const refCode = `function qc_math_reference
        compile_opt idl2
        breakpoints = [0.0, 0.15, 0.4, 0.75, 1.0]
        data = randomu(1L, 1000000)
        bins = value_locate(breakpoints, data)
        return, bins
        end`;

      const refPath = join(outDir, 'qc_math_reference.pro');
      await writeFile(refPath, refCode, 'utf-8');

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');

        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }

        const passed = await compareIDLFunctions(
          'qc_math_test',
          'qc_math_reference',
          output,
        );
        return passed;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 2: Neighborhood average downsample',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that downsamples a 2D float image by an integer factor ' +
          'using neighborhood averaging. The function takes no parameters — inside, create a test image ' +
          'with RANDOMU(42L, 100, 100) and use a downsampling factor of 3. Handle the case where dimensions ' +
          'are not evenly divisible by the factor by trimming excess pixels from the right/bottom edges. ' +
          'Only output the function called qc_math_test_02, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use REBIN for averaging (not CONGRID, not loops)
      const usesRebin = lower.includes('rebin(');
      const usesCongrid = lower.includes('congrid(');
      const usesForLoop = /\bfor\s+\w+\s*=/.test(lower);
      const usesSample = lower.includes('/sample');

      if (!usesRebin) {
        output.appendLine('  FAIL: Does not use REBIN for averaging');
        return false;
      }
      if (usesCongrid) {
        output.appendLine(
          '  FAIL: Uses CONGRID (interpolation, not averaging)',
        );
        return false;
      }
      if (usesForLoop) {
        output.appendLine('  FAIL: Uses FOR loops instead of REBIN');
        return false;
      }
      if (usesSample) {
        output.appendLine(
          '  FAIL: Uses /SAMPLE (nearest neighbor, not averaging)',
        );
        return false;
      }

      // Must trim before REBIN
      const trims =
        lower.includes('trim') ||
        lower.includes('nx_trim') ||
        lower.includes('/ factor') ||
        lower.includes('/factor') ||
        lower.includes('* factor') ||
        lower.includes('*factor') ||
        lower.includes('mod') ||
        lower.includes('floor(');
      if (!trims) {
        output.appendLine(
          '  FAIL: Does not trim dimensions to a multiple of factor before REBIN',
        );
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_02.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 3: Safe WHERE pattern',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that filters a float array, keeping only elements above a threshold. ' +
          'The function takes no parameters — inside, define arr = [1.0, 5.0, 3.0, 8.0, 2.0, 9.0, 0.5] ' +
          'and threshold = 4.0. If no elements exceed the threshold, return !NULL. Handle edge cases safely. ' +
          'Only output the function called qc_math_test_03, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use WHERE safely — either with count parameter or /NULL keyword
      const usesWhere = lower.includes('where(');
      const usesNullKeyword =
        lower.includes('/null') &&
        (lower.includes('where(') || lower.includes('where ('));
      const usesCount =
        lower.includes(', count') ||
        lower.includes(',count') ||
        lower.includes(', n_match') ||
        lower.includes(', cnt');
      const checksCount =
        lower.includes('count eq 0') ||
        lower.includes('count le 0') ||
        lower.includes('count lt 1') ||
        lower.includes('count eq 0') ||
        lower.includes('cnt eq 0') ||
        lower.includes('n_match eq 0') ||
        lower.includes('count ne 0') ||
        lower.includes('count gt 0') ||
        lower.includes('cnt ne 0') ||
        lower.includes('cnt gt 0');
      const returnsNull = lower.includes('!null');

      // Safe WHERE: either uses /null keyword OR uses count + checks it
      const safePattern = usesNullKeyword || (usesCount && checksCount);

      if (!usesWhere) {
        output.appendLine('  FAIL: Does not use WHERE');
        return false;
      }
      if (!safePattern) {
        output.appendLine(
          '  FAIL: Does not use a safe WHERE pattern (needs /NULL keyword or count parameter with check)',
        );
        return false;
      }
      if (!returnsNull) {
        output.appendLine('  FAIL: Does not return !NULL for no matches');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_03.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      // Reference: self-contained gold standard
      const refCode = [
        'function qc_code_ref_03',
        '  compile_opt idl2',
        '  arr = [1.0, 5.0, 3.0, 8.0, 2.0, 9.0, 0.5]',
        '  threshold = 4.0',
        '  idx = WHERE(arr GT threshold, count)',
        '  if count eq 0 then return, !NULL',
        '  return, arr[idx]',
        'end',
      ].join('\n');

      await writeFile(join(outDir, 'qc_code_ref_03.pro'), refCode, 'utf-8');

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }

        const passed = await compareIDLFunctions(
          'qc_math_test_03',
          'qc_code_ref_03',
          output,
        );
        return passed;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 4: Column-major rotation matrix',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that creates a 2D rotation matrix for angle_deg = 45.0 degrees and applies it ' +
          'to a [2, 3] array of 2D points: [[1.0, 0.0, -1.0], [0.0, 1.0, 0.0]] (first row X, second row Y). ' +
          'The function takes no parameters — define all data inside. Return rotated points in [2, N] format. ' +
          'Only output the function called qc_math_test_04, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use ## operator (not # or *)
      const usesDoubleHash = lower.includes('##');
      const usesDtor = lower.includes('!dtor') || lower.includes('!const.dtor');
      const usesForLoop = /\bfor\s+\w+\s*=/.test(lower);

      if (!usesDoubleHash) {
        output.appendLine(
          '  FAIL: Does not use ## operator for matrix multiply',
        );
        return false;
      }
      if (!usesDtor) {
        output.appendLine(
          '  FAIL: Does not use !DTOR for degree-to-radian conversion',
        );
        return false;
      }
      if (usesForLoop) {
        output.appendLine('  FAIL: Uses FOR loops for matrix construction');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_04.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 5: Histogram reverse index grouping',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that groups array indices by class label. ' +
          'The function takes no parameters — inside, define labels = [0, 2, 1, 0, 2, 2, 1]. ' +
          'Return a LIST where each element is an array of original indices belonging to that class. ' +
          "Use HISTOGRAM's REVERSE_INDICES for efficiency. " +
          'Only output the function called qc_math_test_05, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use HISTOGRAM + REVERSE_INDICES (not WHERE in a loop)
      const usesHistogram = lower.includes('histogram(');
      const usesReverseIndices = lower.includes('reverse_indices');
      const usesCanonicalPattern =
        lower.includes('ri[ri[') || lower.includes('ri[ri[i]');

      if (!usesHistogram) {
        output.appendLine('  FAIL: Does not use HISTOGRAM');
        return false;
      }
      if (!usesReverseIndices) {
        output.appendLine('  FAIL: Does not use REVERSE_INDICES');
        return false;
      }
      if (!usesCanonicalPattern) {
        output.appendLine(
          '  FAIL: Does not use the canonical ri[ri[i] : ri[i+1]-1] pattern',
        );
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_05.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 6: Type-safe large array accumulation',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that computes the mean of a BYTE array as a DOUBLE, ' +
          'being careful about integer overflow during summation. ' +
          'The function takes no parameters — inside, define data = BYTE(BINDGEN(256)). ' +
          'Only output the function called qc_math_test_06, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use TOTAL or MEAN with /DOUBLE (not cast entire array, not loop)
      const usesDoubleAccumulation =
        (lower.includes('total(') || lower.includes('mean(')) &&
        lower.includes('/double');
      const usesForLoop = /\bfor\s+\w+\s*=/.test(lower);

      if (!usesDoubleAccumulation) {
        output.appendLine(
          '  FAIL: Does not use TOTAL(..., /DOUBLE) or MEAN(..., /DOUBLE) for accumulation',
        );
        return false;
      }
      if (usesForLoop) {
        output.appendLine('  FAIL: Uses FOR loop for accumulation');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_06.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      // Reference: gold standard using TOTAL /DOUBLE
      const refCode = [
        'function qc_code_ref_06',
        '  compile_opt idl2',
        '  data = BYTE(BINDGEN(256))',
        '  pixel_sum = TOTAL(data, /DOUBLE)',
        '  return, pixel_sum / N_ELEMENTS(data)',
        'end',
      ].join('\n');

      await writeFile(join(outDir, 'qc_code_ref_06.pro'), refCode, 'utf-8');

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }

        const passed = await compareIDLFunctions(
          'qc_math_test_06',
          'qc_code_ref_06',
          output,
        );
        return passed;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 7: Smoothing with NaN handling',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that applies a 5-element boxcar smooth to a 1D float array with NaN values. ' +
          "NaN values should not corrupt their neighbors — use CONVOL's NaN handling and normalization. " +
          'The function takes no parameters — inside, define ' +
          'data = [1.0, !VALUES.F_NAN, 3.0, 4.0, !VALUES.F_NAN, 6.0, 7.0, 8.0, 9.0, 10.0]. ' +
          'Return the smoothed array with original NaN positions preserved. ' +
          'Only output the function called qc_math_test_07, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use CONVOL with /NAN, /NORMALIZE, /EDGE_TRUNCATE
      const usesConvol = lower.includes('convol(');
      const usesNan = lower.includes('/nan');
      const usesNormalize = lower.includes('/normalize');
      const usesEdgeTruncate = lower.includes('/edge_truncate');
      const usesSmooth = lower.includes('smooth(');

      if (!usesConvol) {
        output.appendLine('  FAIL: Does not use CONVOL');
        return false;
      }
      if (usesSmooth) {
        output.appendLine(
          "  FAIL: Uses SMOOTH (doesn't handle NaN as flexibly)",
        );
        return false;
      }
      if (!usesNan) {
        output.appendLine('  FAIL: Does not use /NAN keyword');
        return false;
      }
      if (!usesNormalize) {
        output.appendLine('  FAIL: Does not use /NORMALIZE keyword');
        return false;
      }
      if (!usesEdgeTruncate) {
        output.appendLine('  FAIL: Does not use /EDGE_TRUNCATE keyword');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_07.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 8: Expanding a LUT across an image',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that applies a 256-element lookup table (BYTE values) to a BYTE image. ' +
          'The LUT maps input pixel values to output pixel values. Do not use loops. ' +
          'The function takes no parameters — inside, define ' +
          'image = BYTE([0, 1, 2, 255, 128, 64, 32]) and lut = BYTE(255 - BINDGEN(256)). ' +
          'Only output the function called qc_math_test_08, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use direct array indexing (lut[image])
      const usesDirectIndex =
        lower.includes('lut[image') ||
        lower.includes('lut[img') ||
        lower.includes('lut[byte_image') ||
        lower.includes('lut[input');
      const usesForLoop = /\bfor\s+\w+\s*=/.test(lower);
      const usesHistogram = lower.includes('histogram(');

      if (!usesDirectIndex) {
        output.appendLine(
          '  FAIL: Does not use direct array indexing (lut[image])',
        );
        return false;
      }
      if (usesForLoop) {
        output.appendLine('  FAIL: Uses FOR loop');
        return false;
      }
      if (usesHistogram) {
        output.appendLine('  FAIL: Overcomplicates with HISTOGRAM');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_08.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      // Reference: gold standard using direct array indexing
      const refCode = [
        'function qc_code_ref_08',
        '  compile_opt idl2',
        '  image = BYTE([0, 1, 2, 255, 128, 64, 32])',
        '  lut = BYTE(255 - BINDGEN(256))',
        '  return, lut[image]',
        'end',
      ].join('\n');

      await writeFile(join(outDir, 'qc_code_ref_08.pro'), refCode, 'utf-8');

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }

        const passed = await compareIDLFunctions(
          'qc_math_test_08',
          'qc_code_ref_08',
          output,
        );
        return passed;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 9: Struct array filtering and field extraction',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that filters an array of structures with fields {X: 0.0, Y: 0.0, CLASS: 0} ' +
          'to return only X and Y values where CLASS equals a target value. ' +
          'The function takes no parameters — inside, create 5+ test structures and filter for target_class = 1. ' +
          'Return the result as a [2, N] float array. ' +
          'Only output the function called qc_math_test_09, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use vectorized struct field access + WHERE
      const usesWhere = lower.includes('where(');
      const usesVectorField =
        /\w+\.class\b/.test(lower) || /\w+\.x\b/.test(lower);
      const usesCount =
        lower.includes(', count') ||
        lower.includes(',count') ||
        lower.includes(', n_match') ||
        lower.includes(', cnt');

      if (!usesWhere) {
        output.appendLine('  FAIL: Does not use WHERE for filtering');
        return false;
      }
      if (!usesVectorField) {
        output.appendLine(
          '  FAIL: Does not use vectorized struct field access (structs.FIELD)',
        );
        return false;
      }
      if (!usesCount) {
        output.appendLine('  FAIL: Missing WHERE count check');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_09.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 10: Cumulative distribution with TOTAL',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that computes the empirical cumulative distribution function (CDF). ' +
          'The function takes no parameters — inside, define data = [3.0, 1.0, 4.0, 1.0, 5.0, 9.0, 2.0, 6.0]. ' +
          'Return a structure {X: sorted_values, CDF: cumulative_probabilities}. ' +
          'Only output the function called qc_math_test_10, any explanations should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must sort and use index generation or TOTAL /CUMULATIVE
      const usesSort = lower.includes('sort(');
      const usesIndexGen =
        lower.includes('findgen(') ||
        lower.includes('dindgen(') ||
        lower.includes('lindgen(') ||
        lower.includes('indgen(');
      const usesTotalCumulative =
        lower.includes('/cumulative') || lower.includes('total(');
      const usesForLoop = /\bfor\s+\w+\s*=/.test(lower);
      const returnsStruct =
        lower.includes('{x:') ||
        lower.includes('{ x:') ||
        lower.includes('{x :');

      if (!usesSort) {
        output.appendLine('  FAIL: Does not sort the data');
        return false;
      }
      if (usesForLoop) {
        output.appendLine('  FAIL: Uses FOR loop for cumulative sum');
        return false;
      }
      if (!usesIndexGen && !usesTotalCumulative) {
        output.appendLine(
          '  FAIL: Does not use FINDGEN/DINDGEN/INDGEN or TOTAL /CUMULATIVE for CDF',
        );
        return false;
      }
      if (!returnsStruct) {
        output.appendLine('  FAIL: Does not return a structure');
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_10.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
  {
    name: 'Code 11: Masked median filter',
    run: async ({ agent, output, withTools }) => {
      const result = await agent.sendtoSimulation({
        prompt:
          'In IDL, write a function that performs a 3x3 median filter on a 2D float image, only modifying ' +
          'pixels where a byte mask equals 1. Unmasked pixels retain their original values. ' +
          'The function takes no parameters — inside, create a 10x10 test image with RANDOMU(42L, 10, 10) ' +
          'and a byte mask of the same size. Only output the function called qc_math_test_11, any explanations ' +
          'should be comments. Do not make a file.',
        includeInstructions: withTools,
        includeTools: withTools,
      });
      output.appendLine(`  Response: ${result.text}`);
      const lower = result.text.toLowerCase();

      // Must use MEDIAN on full image, then selectively replace
      const usesMedian = lower.includes('median(');
      const usesWhere = lower.includes('where(');
      const usesConvol = lower.includes('convol(');

      if (!usesMedian) {
        output.appendLine('  FAIL: Does not use MEDIAN for median filtering');
        return false;
      }
      if (usesConvol) {
        output.appendLine(
          '  FAIL: Uses CONVOL instead of MEDIAN for median filter',
        );
        return false;
      }
      if (!usesWhere) {
        output.appendLine(
          '  FAIL: Does not use WHERE to selectively replace masked pixels',
        );
        return false;
      }

      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        output.appendLine('  No workspace folder found');
        return false;
      }

      const code = extractCodeBlock(result.text);
      const outDir = join(folders[0].uri.fsPath, TestCodeDirectory);
      const outPath = join(outDir, 'qc_math_test_11.pro');

      await mkdir(outDir, { recursive: true });
      await writeFile(outPath, code, 'utf-8');
      output.appendLine(`  Wrote IDL code to: ${outPath}`);

      const runResult = await runIDLFile(outPath, output);
      if (!runResult) {
        output.appendLine('  Could not start IDL');
        return false;
      }

      if (runResult.success) {
        output.appendLine('  Executed in IDL successfully');
        if (runResult.idlOutput) {
          output.appendLine(`  IDL output: ${runResult.idlOutput}`);
        }
        return true;
      } else {
        output.appendLine(
          `  IDL execution failed: ${runResult.err || 'unknown error'}`,
        );
        return false;
      }
    },
  },
];
