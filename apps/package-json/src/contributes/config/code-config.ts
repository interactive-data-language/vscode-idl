import { GetExtensionPath, IDL_LANGUAGE_NAME } from '@idl/shared';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';
import { readFileSync, writeFileSync } from 'fs';

import { IPackageNLS } from '../../package.interface';
import { EXTENSION_CONFIG } from '../contributes-configuration.interface';
import { GetNLS } from '../helpers/get-nls';
import { VerifyNLS } from '../helpers/verify-nls';
import { IDL_CONFIG_SCOPE } from './idl-config-scope.interface';
import {
  TranslationFromConfiguration,
  TranslationFromConfigurationChoices,
} from './translation-from-configuration';

/**
 * Updates JSON schema files to use our translation files
 */
function UpdateSchemaFiles(config: { [key: string]: any }, nls: IPackageNLS) {
  // update base schema
  const base = JSON.parse(
    readFileSync(
      GetExtensionPath('extension/language/schemas/config/schema.json'),
      { encoding: 'utf-8' }
    )
  );

  // verify child
  if (!('properties' in base)) {
    throw new Error(
      'Expected "properties" key not found in idl.json schema.json file'
    );
  }

  /** Properties for VSCode schema */
  const vsCodeBase =
    config[`${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.codeFormatting}`];

  /** Properties from VSCode */
  const vsCodeProperties = vsCodeBase.properties;

  /** Defaults from VSCode */
  const baseDefault = vsCodeBase.default;

  // set literal description, so it matches our VSCode UI
  base.description = GetNLS(vsCodeBase.description, nls);

  /** Properties for base scema */
  const baseProperties = base['properties'];

  const properties1 = Object.keys(vsCodeProperties);
  for (let i = 0; i < properties1.length; i++) {
    // validate correctness
    if (!(properties1[i] in baseProperties)) {
      throw new Error(
        `Property "${properties1[i]}" is missing from the idl.json schema file`
      );
    }
    const vsProp = vsCodeProperties[properties1[i]];
    const baseProp = baseProperties[properties1[i]];
    baseProp.description = GetNLS(vsProp.description, nls);

    // verify default
    if (!(properties1[i] in baseDefault)) {
      throw new Error(
        `Property "${properties1[i]}" has no default in VSCode configuration`
      );
    }

    // inherit enum
    baseProp.enum = vsProp.enum;
    baseProp.default = baseDefault[properties1[i]];
  }

  // write to disk
  writeFileSync(
    GetExtensionPath('extension/language/schemas/config/schema.json'),
    JSON.stringify(base, undefined, 2)
  );

  // load actual schema for config tags
  const details = JSON.parse(
    readFileSync(
      GetExtensionPath('extension/language/schemas/config/v1.schema.json'),
      { encoding: 'utf-8' }
    )
  );

  // verify child
  if (!('definitions' in details)) {
    throw new Error(
      'Expected "definitions" key not found in idl.json v1.schema.json file'
    );
  }
  const detailDefinitions = details['definitions'];

  // verify child
  if (!('1.0.0-options' in detailDefinitions)) {
    throw new Error(
      'Expected "1.0.0-options" key not found in idl.json v1.schema.json "definitions"'
    );
  }

  const detail = detailDefinitions['1.0.0-options'];

  /** Properties for VSCode schema */
  const vsCodeDetail =
    config[
      `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.codeFormattingStyle}`
    ];

  /** Properties from VSCode */
  const vsCodeDetailProperties = vsCodeDetail.properties;

  /** Defaults from VSCode */
  const detailDefault = vsCodeDetail.default;

  // set literal description, so it matches our VSCode UI
  detail.description = GetNLS(vsCodeDetail.description, nls);

  /** Properties for base scema */
  const detailProperties = detail['properties'];

  const properties2 = Object.keys(vsCodeDetailProperties);
  for (let i = 0; i < properties2.length; i++) {
    // validate correctness
    if (!(properties2[i] in detailProperties)) {
      throw new Error(
        `Property "${properties2[i]}" is missing from the idl.json v1.schema.json file`
      );
    }
    const vsProp = vsCodeDetailProperties[properties2[i]];
    const baseProp = detailProperties[properties2[i]];
    baseProp.description = GetNLS(vsProp.description, nls);

    // verify default
    if (!(properties2[i] in detailDefault)) {
      throw new Error(
        `Property "${properties2[i]}" has no default in VSCode configuration`
      );
    }

    // inherit enum
    baseProp.enum = vsProp.enum;
    baseProp.default = detailDefault[properties2[i]];
  }

  // save to disk
  writeFileSync(
    GetExtensionPath('extension/language/schemas/config/v1.schema.json'),
    JSON.stringify(details, undefined, 2)
  );
}

/**
 * Registers configuration for code in our IDL extension
 */
export function AddCodeConfig(nls: IPackageNLS) {
  // root folder
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.formatting%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  const formatPropertyBase = `properties.${IDL_EXTENSION_CONFIG_KEYS.codeFormatting}`;

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.codeFormatting}`
  ] = {
    type: 'object',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.codeFormatting,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    additionalProperties: false,
    default: DEFAULT_IDL_EXTENSION_CONFIG.code.formatting,
    properties: {
      autoDoc: {
        type: 'boolean',
        description: TranslationFromConfiguration(
          'autoDoc',
          nls,
          formatPropertyBase
        ),
      },
      autoFix: {
        type: 'boolean',
        description: TranslationFromConfiguration(
          'autoFix',
          nls,
          formatPropertyBase
        ),
      },
      eol: {
        type: 'string',
        description: TranslationFromConfiguration(
          'eol',
          nls,
          formatPropertyBase
        ),
        enum: ['lf', 'crlf'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lf', 'crlf'],
          nls,
          'enumDescriptions.formatting.eol'
        ),
      },
      styleAndFormat: {
        type: 'boolean',
        description: TranslationFromConfiguration(
          'styleAndFormat',
          nls,
          formatPropertyBase
        ),
      },
      tabWidth: {
        type: 'number',
        description: TranslationFromConfiguration(
          'tabWidth',
          nls,
          formatPropertyBase
        ),
      },
    },
  };

  const formatStylePropertyBase = `properties.${IDL_EXTENSION_CONFIG_KEYS.codeFormattingStyle}`;

  // should our extension run in debug mode
  ourConfig.properties[
    `${IDL_LANGUAGE_NAME}.${IDL_EXTENSION_CONFIG_KEYS.codeFormattingStyle}`
  ] = {
    type: 'object',
    description: TranslationFromConfiguration(
      IDL_EXTENSION_CONFIG_KEYS.codeFormattingStyle,
      nls
    ),
    scope: IDL_CONFIG_SCOPE,
    additionalProperties: false,
    default: DEFAULT_IDL_EXTENSION_CONFIG.code.formattingStyle,
    properties: {
      binary: {
        type: 'string',
        description: TranslationFromConfiguration(
          'binary',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      control: {
        type: 'string',
        description: TranslationFromConfiguration(
          'control',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      hex: {
        type: 'string',
        description: TranslationFromConfiguration(
          'hex',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      keywords: {
        type: 'string',
        description: TranslationFromConfiguration(
          'keywords',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      localVariables: {
        type: 'string',
        description: TranslationFromConfiguration(
          'localVariables',
          nls,
          formatStylePropertyBase
        ),
        enum: ['match', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      methods: {
        type: 'string',
        description: TranslationFromConfiguration(
          'methods',
          nls,
          formatStylePropertyBase
        ),
        enum: ['dot', 'arrow', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['dot', 'arrow', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      numbers: {
        type: 'string',
        description: TranslationFromConfiguration(
          'numbers',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      octal: {
        type: 'string',
        description: TranslationFromConfiguration(
          'octal',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      properties: {
        type: 'string',
        description: TranslationFromConfiguration(
          'properties',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'match', 'camel', 'pascal', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'match', 'camel', 'pascal', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      quotes: {
        type: 'string',
        description: TranslationFromConfiguration(
          'quotes',
          nls,
          formatStylePropertyBase
        ),
        enum: ['single', 'double', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['single', 'double', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      routines: {
        type: 'string',
        description: TranslationFromConfiguration(
          'routines',
          nls,
          formatStylePropertyBase
        ),
        enum: ['match', 'camel', 'pascal', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'camel', 'pascal', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      routineMethods: {
        type: 'string',
        description: TranslationFromConfiguration(
          'routineMethods',
          nls,
          formatStylePropertyBase
        ),
        enum: ['match', 'camel', 'pascal', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'camel', 'pascal', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      structureNames: {
        type: 'string',
        description: TranslationFromConfiguration(
          'structureNames',
          nls,
          formatStylePropertyBase
        ),
        enum: ['match', 'camel', 'pascal', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['match', 'camel', 'pascal', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
      systemVariables: {
        type: 'string',
        description: TranslationFromConfiguration(
          'systemVariables',
          nls,
          formatStylePropertyBase
        ),
        enum: ['lower', 'upper', 'none'],
        enumDescriptions: TranslationFromConfigurationChoices(
          ['lower', 'upper', 'none'],
          nls,
          'enumDescriptions.formatting.style'
        ),
      },
    },
  };

  // save our extension config
  EXTENSION_CONFIG.push(ourConfig);

  UpdateSchemaFiles(ourConfig.properties, nls);
}
