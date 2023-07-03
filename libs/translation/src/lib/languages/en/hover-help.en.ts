import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

import { IHoverHelpTranslations } from '../../translation.interface';

/**
 * English translations for custom hover help
 */
export const HOVER_HELP_EN: IHoverHelpTranslations = {
  control: {
    break: readFileSync(
      GetExtensionPath('extension/docs/control/en/break.md'),
      'utf-8'
    ),
    case: readFileSync(
      GetExtensionPath('extension/docs/control/en/case.md'),
      'utf-8'
    ),
    continue: readFileSync(
      GetExtensionPath('extension/docs/control/en/continue.md'),
      'utf-8'
    ),
    else: readFileSync(
      GetExtensionPath('extension/docs/control/en/else.md'),
      'utf-8'
    ),
    for: readFileSync(
      GetExtensionPath('extension/docs/control/en/for.md'),
      'utf-8'
    ),
    foreach: readFileSync(
      GetExtensionPath('extension/docs/control/en/foreach.md'),
      'utf-8'
    ),
    function: readFileSync(
      GetExtensionPath('extension/docs/control/en/function.md'),
      'utf-8'
    ),
    if: readFileSync(
      GetExtensionPath('extension/docs/control/en/if.md'),
      'utf-8'
    ),
    pro: readFileSync(
      GetExtensionPath('extension/docs/control/en/pro.md'),
      'utf-8'
    ),
    switch: readFileSync(
      GetExtensionPath('extension/docs/control/en/switch.md'),
      'utf-8'
    ),
    while: readFileSync(
      GetExtensionPath('extension/docs/control/en/while.md'),
      'utf-8'
    ),
  },
};
