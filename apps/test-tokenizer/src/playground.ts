import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { IParsed, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { TimeIt } from '@idl/shared';
import { TextMateParse } from '@idl/tests/helpers';
import copy from 'fast-copy';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { performance } from 'perf_hooks';
import * as prettier from 'prettier';
import { IToken } from 'vscode-textmate';

import { PLAYGROUND_CODE } from './playground-code';

/**
 * Nicely format any object as JSON so that it matches the default prettier formatting
 */
function Stringify(object: any): string {
  return prettier.format(JSON.stringify(object, null, 2), { parser: 'json' });
}

/** How many times to run the tokenizer to warm up our algorithms */
const WARM_UP = 2;

/**
 * Routine meant to be changed and customized by developer to have their own `playground` to
 * change behavior and test functionality
 */
export async function Playground() {
  try {
    // warm up for better performance metrics
    console.log();
    console.log('Warming up algorithms...');
    for (let i = 0; i < WARM_UP; i++) {
      Parser(PLAYGROUND_CODE, new CancellationToken(), { cleanup: false });
      await TextMateParse(PLAYGROUND_CODE);
    }
    console.log('  Ready to rock!');

    /**
     * Parse our code to get all the gory details for what we have
     */
    let parsed: IParsed;
    const t1 = TimeIt(() => {
      parsed = Parser(PLAYGROUND_CODE, new CancellationToken(), {
        cleanup: false,
      });
    });
    console.log();
    console.log(`Parser time (ms): ${t1}`);

    /**
     * Parse our code to get all the gory details for what we have
     */
    let tmParsed: IToken[] = [];
    const t110 = performance.now();
    try {
      tmParsed = await TextMateParse(PLAYGROUND_CODE);
    } catch (err) {
      console.log(err);
    }
    const t11 = performance.now() - t110;
    console.log();
    console.log(`TextMate time (ms): ${t11}`);
    // console.log(tmParsed);

    /**
     * Copy parsed because formatting changes it
     */
    const formattedTokenized = copy(parsed);

    /**
     * Format our code
     */
    let formatted: string | undefined;
    const t2 = TimeIt(() => {
      formatted = 'no';
      formatted = Assembler(formattedTokenized, new CancellationToken(), {
        formatter: 'fiddle',
        autoDoc: true,
        style: {},
      });
    });
    console.log();
    console.log(`Format time (ms): ${t2}`);

    /**
     * Write all of our outputs to disk
     */

    /**
     * Make sure destination folder exists
     */
    if (!existsSync(join(process.cwd(), 'parse-test'))) {
      mkdirSync(join(process.cwd(), 'parse-test'));
    }

    /**
     * Nicely formatted strings of our code matching the automated syntax tests
     * to easily add directly into the automated files or crafted test files
     */
    const forTests: string[] = [];

    // nicely write code to disk for quickly adding to automated tests
    const split: string[] = Array.isArray(PLAYGROUND_CODE)
      ? (PLAYGROUND_CODE as string[])
      : (PLAYGROUND_CODE as string).split(`\n`);
    forTests.push(`const CODE = [`);
    for (let i = 0; i < split.length; i++) {
      forTests.push(`  \`${split[i]}\`,`);
    }
    forTests.push(`]`);

    RemoveScopeDetail(parsed, new CancellationToken());
    RemoveScopeDetail(formattedTokenized, new CancellationToken());

    // save outputs to disk
    writeFileSync(
      join(process.cwd(), 'parse-test', 'code.js'),
      forTests.join(`\n`)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'tokens.json'),
      Stringify(parsed.tokens)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'textmate.json'),
      Stringify(tmParsed)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'tree.json'),
      Stringify(parsed.tree)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'tree-assembled.json'),
      Stringify(formattedTokenized.tree)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'problems.json'),
      Stringify(parsed.parseProblems)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'global.json'),
      Stringify(parsed.global)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'local.json'),
      Stringify(parsed.local)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'compile.json'),
      Stringify(parsed.compile)
    );
    writeFileSync(
      join(process.cwd(), 'parse-test', 'formatted.pro'),
      formatted !== undefined
        ? formatted
        : '; Syntax error prevents formatting, check closing statements'
    );
    // log some useful information
    console.log();
    console.log(`Output folder: "${join(process.cwd(), 'parse-test')}"`);
    console.log(`Helpful files in destination:`);
    console.log(
      `  "code.js"              contains version of processed code for using in tests`
    );
    console.log(
      `  "formatted.pro"        contains the formatted version of source code`
    );
    console.log(
      `  "global.json"          contains globally available tokens from code`
    );
    console.log(
      `  "local.json"           contains local tokens within routines`
    );
    console.log(`  "compile.json"         contains compile options by routine`);
    console.log(`  "problems.json"        contains detected syntax problems`);
    console.log(
      `  "tokens.json"          contains raw tokens extracted from code`
    );
    console.log(
      `  "textmate.json"        contains raw tokens extracted from code using tmLanguage grammar`
    );
    console.log(
      `  "tree.json"            contains AST version of tokens with post-processing applied`
    );
    console.log(
      `  "tree-assembled.json"  contains AST version of tokens after formatting`
    );
    console.log();

    // await LoadConfig(
    //   'C:\\Users\\zach\\Documents\\github\\awesome-vscode-idl\\extension\\idl\\test\\workspace1\\.idlrc.json'
    // );

    // helpful folders
    // const dir = `/Applications/harris/envi56/idl88/lib`;
    // const dir = `C:\\Program Files\\Harris\\ENVI57\\IDL89\\lib`;

    // // // only parse with the parser
    // await TokenizerTest(dir);

    // // // parse with the IDLIndex and apply all validation and post-processing
    // await TokenizerTest(dir, true);

    // // parse with textmate parser
    // await TMParseTest(dir);

    // verify formatting is correct
    // await FormatTest(dir);
  } catch (err) {
    console.log(err);
  }
}
