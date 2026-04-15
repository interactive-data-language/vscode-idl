import {
  CreateENVIModelerWorkflow,
  ValidateENVIModelerNodes,
} from '@idl/envi/modeler';
import { LogManager } from '@idl/logger';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLIndex } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { IENVIModelerTest } from '../tests.interface';

/**
 * Generates tests for ENVI Modeler validation and workflow creation.
 *
 * At generation time this bootstraps a real MCPTaskRegistry (same pattern as
 * the sandbox) to capture expected errors and workflow output as inline
 * snapshots. Each generated spec file re-creates the same setup so that
 * tests are self-contained and exercise real task registration.
 */
export async function TestsForENVIModeler(
  name: string,
  tests: IENVIModelerTest[],
  uri = join(process.cwd(), 'tokens.ts'),
) {
  // track our strings
  const strings: string[] = [];

  // --- imports ---
  strings.push(
    `import { CreateENVIModelerWorkflow, ValidateENVIModelerNodes } from '@idl/envi/modeler';`,
  );
  strings.push(`import { LogManager } from '@idl/logger';`);
  strings.push(`import { MCPTaskRegistry } from '@idl/mcp/tasks';`);
  strings.push(
    `import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';`,
  );
  strings.push(
    `import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';`,
  );
  strings.push(
    `import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/mcp';`,
  );
  strings.push(
    `import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';`,
  );
  strings.push(``);
  strings.push(`IDL_INDEX_OPTIONS.IS_TEST = true;`);
  strings.push(``);

  // --- module-level registry setup (once per spec file, outside describe) ---
  strings.push(`// create log manager`);
  strings.push(`const logManager = new LogManager({`);
  strings.push(`  alert: () => {`);
  strings.push(`    // do nothing`);
  strings.push(`  },`);
  strings.push(`});`);
  strings.push(``);
  strings.push(`// create index`);
  strings.push(`const index = new IDLIndex(logManager, 1, false);`);
  strings.push(``);
  strings.push(`// load global tokens`);
  strings.push(`index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);`);
  strings.push(``);
  strings.push(`// create registry`);
  strings.push(`const registry = new MCPTaskRegistry(logManager);`);
  strings.push(``);
  strings.push(`// populate registry`);
  strings.push(`registry.registerTasksFromGlobalTokens(`);
  strings.push(
    `  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],`,
  );
  strings.push(
    `  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],`,
  );
  strings.push(`);`);
  strings.push(``);

  // --- bootstrap generation-time registry to capture expected outputs ---
  const genLogManager = new LogManager({
    alert: () => {
      // do nothing
    },
  });
  const genIndex = new IDLIndex(genLogManager, 1, false);
  genIndex.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);
  const genRegistry = new MCPTaskRegistry(genLogManager);
  genRegistry.registerTasksFromGlobalTokens(
    genIndex.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],
    genIndex.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],
  );

  // --- describe block ---
  strings.push(`describe(\`[auto generated] ${name}\`, () => {`);

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const testName = test.name;

    // run validation at generation time to capture expected outputs
    const errors = ValidateENVIModelerNodes(
      test.nodes,
      test.edges,
      genRegistry,
    );

    let workflow: Record<string, unknown> | undefined;
    if (errors.length === 0) {
      workflow = CreateENVIModelerWorkflow(test.nodes, test.edges, genRegistry);
    }

    // serialize nodes and edges as JSON literals
    const nodesStr = JSON.stringify(test.nodes, null, 2);
    const edgesStr = JSON.stringify(test.edges, null, 2);

    strings.push(`  it(\`[auto generated] ${testName}\`, () => {`);
    strings.push(`    // define nodes`);
    strings.push(`    const nodes: ENVIModelerNode[] = ${nodesStr};`);
    strings.push(``);
    strings.push(`    // define edges`);
    strings.push(`    const edges: ENVIModelerEdge[] = ${edgesStr};`);
    strings.push(``);
    strings.push(`    // validate nodes`);
    strings.push(
      `    const errors = ValidateENVIModelerNodes(nodes, edges, registry);`,
    );
    strings.push(``);
    strings.push(`    // define expected errors`);
    strings.push(
      `    const expectedErrors: string[] = ${JSON.stringify(errors)};`,
    );
    strings.push(``);
    strings.push(`    // verify errors`);
    strings.push(`    expect(errors).toEqual(expectedErrors);`);

    if (workflow !== undefined) {
      strings.push(``);
      strings.push(`    // define expected workflow`);
      strings.push(
        `    const expectedWorkflow = ${JSON.stringify(workflow, null, 2)} as Record<string, unknown>;`,
      );
      strings.push(``);
      strings.push(`    // verify workflow`);
      strings.push(
        `    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(expectedWorkflow);`,
      );
    }

    strings.push(`  });`);
    strings.push(``);
  }

  strings.push(`});`);
  strings.push(``);

  writeFileSync(uri, strings.join('\n'));
}
