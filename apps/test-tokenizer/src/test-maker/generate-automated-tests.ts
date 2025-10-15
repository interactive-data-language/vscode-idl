import { IDL_INDEX_OPTIONS } from '@idl/parsing/index';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';

import { TestsForAssembler } from './makers/tests-for-assembler';
import { TestsForAutoComplete } from './makers/tests-for-auto-complete';
import { TestForAutoFixing } from './makers/tests-for-auto-fixing';
import { TestsForConfigFileResolving } from './makers/tests-for-config-file-resolving';
import { TestsForGlobalProblems } from './makers/tests-for-global-problems';
import { TestsForHoverHelp } from './makers/tests-for-hover-help';
import { TestsForLocalGlobalScopeAndCompile } from './makers/tests-for-local-global-scope-compile-and-types';
import { TestsForOutline } from './makers/tests-for-outline';
import { TestsForSemanticTokens } from './makers/tests-for-semantic-tokens';
import { TestsForSyntaxPostProcessors } from './makers/tests-for-syntax-post-processors';
import { TestsForSyntaxValidators } from './makers/tests-for-syntax-validators';
import { TestsForTaskAssembler } from './makers/tests-for-task-assembler';
import { TestsForTaskGeneration } from './makers/tests-for-task-generation';
import { TestsForTaskParsing } from './makers/tests-for-task-parsing';
import { TestsForTextMateTokenizer } from './makers/tests-for-textmate-tokenizer';
import { TestsForTokenAtCursor } from './makers/tests-for-token-at-cursor';
import { TestsForTokenDefinition } from './makers/tests-for-token-definition';
import { TestsForTokenizer } from './makers/tests-for-tokenizer';
import { AUTO_ASSEMBLER_TESTS } from './tests/auto-assembler-tests.interface';
import { AUTO_AUTO_COMPLETE_TESTS } from './tests/auto-auto-complete-tests.interface';
import { AUTO_CONFIG_FILE_RESOLVING } from './tests/auto-config-file-resolving-tests.interface';
import { AUTO_GLOBAL_PROBLEM_TESTS } from './tests/auto-global-problem-tests.interface';
import { AUTO_HOVER_HELP_TESTS } from './tests/auto-hover-help-tests.interface';
import { AUTO_LOCAL_GLOBAL_SCOPE_COMPILE_AND_TYPES_TESTS } from './tests/auto-local-global-scope-compile-and-types-tests.interface';
import { AUTO_OUTLINE_TESTS } from './tests/auto-outline-tests.interface';
import { AUTO_PROBLEM_FIXING_TESTS } from './tests/auto-problem-fixing-tests.interface.';
import { AUTO_SELECTED_TOKEN_TESTS } from './tests/auto-selected-token-tests.interface';
import { AUTO_SEMANTIC_TOKEN_TESTS } from './tests/auto-semantic-token-tests.interface';
import { AUTO_POST_PROCESSOR_TESTS } from './tests/auto-syntax-post-processor-tests.interface';
import { AUTO_SYNTAX_TESTS } from './tests/auto-syntax-validator-tests.interface';
import { AUTO_TASK_ASSEMBLER_TESTS } from './tests/auto-task-assembler-tests.interface';
import { AUTO_TASK_GENERATION_TESTS } from './tests/auto-task-generationtests.interface';
import { AUTO_TASK_PARSING_TESTS } from './tests/auto-task-parsing-tests.interface';
import { AUTO_TOKEN_DEFINITION_TESTS } from './tests/auto-token-definition-tests.interface';
import { AUTO_TOKEN_TESTS } from './tests/auto-token-tests.interface';

/**
 * Update preference for IDL Index to indicate that we can store extra in memory
 */
IDL_INDEX_OPTIONS.IS_TEST = true;

/**
 * Makes sure a test directory exists and, if not using our cache, nukes all files
 */
function CleanTestDir(dir: string) {
  rmSync(dir, { recursive: true });
  mkdirSync(dir, { recursive: true });
}

/**
 * Wrapper that creates the automatically generated tests for the tokenizer.
 *
 * The purpose of this routine is to relieve developer burden. It is expected that a
 * person is in the loop with any new tests that are added and they verify that the tokens
 * are all correct before proceeding.
 */
export async function GenerateAutomatedTests() {
  // specify the output folder
  const outDirToken = join(process.cwd(), 'libs/tests/tokenizer/src/lib');

  // clean test directory
  CleanTestDir(outDirToken);

  // process each test
  console.log('Generating tests for tokenizer');
  for (let i = 0; i < AUTO_TOKEN_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_TOKEN_TESTS[i].suiteName}`);
    await TestsForTokenizer(
      AUTO_TOKEN_TESTS[i].suiteName,
      AUTO_TOKEN_TESTS[i].tests,
      join(outDirToken, AUTO_TOKEN_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirTextMateToken = join(
    process.cwd(),
    'libs/tests/textmate-tokenizer/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirTextMateToken);

  // process each test
  console.log('Generating tests for textmate tokenizer');
  for (let i = 0; i < AUTO_TOKEN_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_TOKEN_TESTS[i].suiteName}`);
    await TestsForTextMateTokenizer(
      AUTO_TOKEN_TESTS[i].suiteName,
      AUTO_TOKEN_TESTS[i].tests,
      join(outDirTextMateToken, AUTO_TOKEN_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirPostProcess = join(
    process.cwd(),
    'libs/tests/syntax-post-processors/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirPostProcess);

  // process each test
  console.log('Generating tests for syntax post processors');
  for (let i = 0; i < AUTO_POST_PROCESSOR_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_POST_PROCESSOR_TESTS[i].suiteName}`);
    await TestsForSyntaxPostProcessors(
      AUTO_POST_PROCESSOR_TESTS[i].suiteName,
      AUTO_POST_PROCESSOR_TESTS[i].tests,
      join(outDirPostProcess, AUTO_POST_PROCESSOR_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirValidators = join(
    process.cwd(),
    'libs/tests/syntax-validators/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirValidators);

  // process each test
  console.log('Generating tests for syntax validators');
  for (let i = 0; i < AUTO_SYNTAX_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_SYNTAX_TESTS[i].suiteName}`);
    await TestsForSyntaxValidators(
      AUTO_SYNTAX_TESTS[i].suiteName,
      AUTO_SYNTAX_TESTS[i].tests,
      join(outDirValidators, AUTO_SYNTAX_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirSelectedToken = join(
    process.cwd(),
    'libs/tests/token-at-cursor/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirSelectedToken);

  // process each test
  console.log('Generating tests for getting token at cursor');
  for (let i = 0; i < AUTO_SELECTED_TOKEN_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_SELECTED_TOKEN_TESTS[i].suiteName}`);
    await TestsForTokenAtCursor(
      AUTO_SELECTED_TOKEN_TESTS[i].suiteName,
      AUTO_SELECTED_TOKEN_TESTS[i].tests,
      join(outDirSelectedToken, AUTO_SELECTED_TOKEN_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirHoverHelp = join(process.cwd(), 'libs/tests/hover-help/src/lib');

  // clean test directory
  CleanTestDir(outDirHoverHelp);

  // process each test
  console.log('Generating tests for getting hover help');
  for (let i = 0; i < AUTO_HOVER_HELP_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_HOVER_HELP_TESTS[i].suiteName}`);
    await TestsForHoverHelp(
      AUTO_HOVER_HELP_TESTS[i].suiteName,
      AUTO_HOVER_HELP_TESTS[i].tests,
      join(outDirHoverHelp, AUTO_HOVER_HELP_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirTokenDef = join(
    process.cwd(),
    'libs/tests/token-definition/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirTokenDef);

  // process each test
  console.log('Generating tests for token definition');
  for (let i = 0; i < AUTO_TOKEN_DEFINITION_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_TOKEN_DEFINITION_TESTS[i].suiteName}`);
    await TestsForTokenDefinition(
      AUTO_TOKEN_DEFINITION_TESTS[i].suiteName,
      AUTO_TOKEN_DEFINITION_TESTS[i].tests,
      join(outDirTokenDef, AUTO_TOKEN_DEFINITION_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirAutoComplete = join(
    process.cwd(),
    'libs/tests/auto-complete/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirAutoComplete);

  // process each test
  console.log('Generating tests for getting auto complete');
  for (let i = 0; i < AUTO_AUTO_COMPLETE_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_AUTO_COMPLETE_TESTS[i].suiteName}`);
    await TestsForAutoComplete(
      AUTO_AUTO_COMPLETE_TESTS[i].suiteName,
      AUTO_AUTO_COMPLETE_TESTS[i].tests,
      join(outDirAutoComplete, AUTO_AUTO_COMPLETE_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirLocalVarsToken = join(
    process.cwd(),
    'libs/tests/local-global-scope-compile/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirLocalVarsToken);

  // process each test
  console.log('Generating tests for local, global, compile, and types');
  for (
    let i = 0;
    i < AUTO_LOCAL_GLOBAL_SCOPE_COMPILE_AND_TYPES_TESTS.length;
    i++
  ) {
    console.log(
      `  Suite (${i}): ${AUTO_LOCAL_GLOBAL_SCOPE_COMPILE_AND_TYPES_TESTS[i].suiteName}`
    );
    await TestsForLocalGlobalScopeAndCompile(
      AUTO_LOCAL_GLOBAL_SCOPE_COMPILE_AND_TYPES_TESTS[i].suiteName,
      AUTO_LOCAL_GLOBAL_SCOPE_COMPILE_AND_TYPES_TESTS[i].tests,
      join(
        outDirLocalVarsToken,
        AUTO_LOCAL_GLOBAL_SCOPE_COMPILE_AND_TYPES_TESTS[i].fileName
      )
    );
  }
  console.log();

  // specify the output folder
  const outDirOutline = join(process.cwd(), 'libs/tests/outline/src/lib');

  // clean test directory
  CleanTestDir(outDirOutline);

  // process each test
  console.log('Generating tests for outline');
  for (let i = 0; i < AUTO_OUTLINE_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_OUTLINE_TESTS[i].suiteName}`);
    await TestsForOutline(
      AUTO_OUTLINE_TESTS[i].suiteName,
      AUTO_OUTLINE_TESTS[i].tests,
      join(outDirOutline, AUTO_OUTLINE_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirSemantic = join(
    process.cwd(),
    'libs/tests/semantic-tokens/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirSemantic);

  // process each test
  console.log('Generating tests for semantic tokens');
  for (let i = 0; i < AUTO_SEMANTIC_TOKEN_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_SEMANTIC_TOKEN_TESTS[i].suiteName}`);
    await TestsForSemanticTokens(
      AUTO_SEMANTIC_TOKEN_TESTS[i].suiteName,
      AUTO_SEMANTIC_TOKEN_TESTS[i].tests,
      join(outDirSemantic, AUTO_SEMANTIC_TOKEN_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirTaskParsing = join(
    process.cwd(),
    'libs/tests/task-parsing/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirTaskParsing);

  // process each test
  console.log('Generating tests for task parsing');
  for (let i = 0; i < AUTO_TASK_PARSING_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_TASK_PARSING_TESTS[i].suiteName}`);
    await TestsForTaskParsing(
      AUTO_TASK_PARSING_TESTS[i].suiteName,
      AUTO_TASK_PARSING_TESTS[i].tests,
      join(outDirTaskParsing, AUTO_TASK_PARSING_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirAssembler = join(process.cwd(), 'libs/tests/assembler/src/lib');

  // clean test directory
  CleanTestDir(outDirAssembler);

  // process each test
  console.log('Generating tests for assembler');
  for (let i = 0; i < AUTO_ASSEMBLER_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_ASSEMBLER_TESTS[i].suiteName}`);
    await TestsForAssembler(
      AUTO_ASSEMBLER_TESTS[i].suiteName,
      AUTO_ASSEMBLER_TESTS[i].tests,
      join(outDirAssembler, AUTO_ASSEMBLER_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirTaskAssembler = join(
    process.cwd(),
    'libs/tests/task-assembler/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirTaskAssembler);

  // process each test
  console.log('Generating tests for task assembler');
  for (let i = 0; i < AUTO_TASK_ASSEMBLER_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_TASK_ASSEMBLER_TESTS[i].suiteName}`);
    await TestsForTaskAssembler(
      AUTO_TASK_ASSEMBLER_TESTS[i].suiteName,
      AUTO_TASK_ASSEMBLER_TESTS[i].tests,
      join(outDirTaskAssembler, AUTO_TASK_ASSEMBLER_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder for fixing
  const outDirFixing = join(process.cwd(), 'libs/tests/auto-fixing/src/lib');

  // clean test directory
  CleanTestDir(outDirFixing);

  // process each test
  console.log('Generating tests for problem fixing');
  for (let i = 0; i < AUTO_PROBLEM_FIXING_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_PROBLEM_FIXING_TESTS[i].suiteName}`);
    await TestForAutoFixing(
      AUTO_PROBLEM_FIXING_TESTS[i].suiteName,
      AUTO_PROBLEM_FIXING_TESTS[i].tests,
      join(outDirFixing, AUTO_PROBLEM_FIXING_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirGlobalProblems = join(
    process.cwd(),
    'libs/tests/global-problems/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirGlobalProblems);

  // process each test
  console.log('Generating tests for global problems');
  for (let i = 0; i < AUTO_GLOBAL_PROBLEM_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_GLOBAL_PROBLEM_TESTS[i].suiteName}`);
    await TestsForGlobalProblems(
      AUTO_GLOBAL_PROBLEM_TESTS[i].suiteName,
      AUTO_GLOBAL_PROBLEM_TESTS[i].tests,
      join(outDirGlobalProblems, AUTO_GLOBAL_PROBLEM_TESTS[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirConfigResolution = join(
    process.cwd(),
    'libs/tests/config-resolution/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirConfigResolution);

  // process each test
  console.log('Generating tests for resolving config files');
  for (let i = 0; i < AUTO_CONFIG_FILE_RESOLVING.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_CONFIG_FILE_RESOLVING[i].suiteName}`);
    await TestsForConfigFileResolving(
      AUTO_CONFIG_FILE_RESOLVING[i].suiteName,
      AUTO_CONFIG_FILE_RESOLVING[i].tests,
      join(outDirConfigResolution, AUTO_CONFIG_FILE_RESOLVING[i].fileName)
    );
  }
  console.log();

  // specify the output folder
  const outDirTaskGeneration = join(
    process.cwd(),
    'libs/tests/task-generation/src/lib'
  );

  // clean test directory
  CleanTestDir(outDirTaskGeneration);

  // process each test
  console.log('Generating tests for task generation');
  for (let i = 0; i < AUTO_TASK_GENERATION_TESTS.length; i++) {
    console.log(`  Suite (${i}): ${AUTO_TASK_GENERATION_TESTS[i].suiteName}`);
    await TestsForTaskGeneration(
      AUTO_TASK_GENERATION_TESTS[i].suiteName,
      AUTO_TASK_GENERATION_TESTS[i].tests,
      join(outDirTaskGeneration, AUTO_TASK_GENERATION_TESTS[i].fileName)
    );
  }
  console.log();
}
