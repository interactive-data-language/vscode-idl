import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

import { IHoverHelpTranslations } from '../../translation.interface';

/**
 * English translations for custom hover help
 */
export const HOVER_HELP_EN: IHoverHelpTranslations = {
  control: {
    break: readFileSync(
      GetExtensionPath('extension/translation/control/en/break.md'),
      'utf-8'
    ),
    case: readFileSync(
      GetExtensionPath('extension/translation/control/en/case.md'),
      'utf-8'
    ),
    continue: readFileSync(
      GetExtensionPath('extension/translation/control/en/continue.md'),
      'utf-8'
    ),
    else: readFileSync(
      GetExtensionPath('extension/translation/control/en/else.md'),
      'utf-8'
    ),
    for: readFileSync(
      GetExtensionPath('extension/translation/control/en/for.md'),
      'utf-8'
    ),
    foreach: readFileSync(
      GetExtensionPath('extension/translation/control/en/foreach.md'),
      'utf-8'
    ),
    function: readFileSync(
      GetExtensionPath('extension/translation/control/en/function.md'),
      'utf-8'
    ),
    if: readFileSync(
      GetExtensionPath('extension/translation/control/en/if.md'),
      'utf-8'
    ),
    pro: readFileSync(
      GetExtensionPath('extension/translation/control/en/pro.md'),
      'utf-8'
    ),
    switch: readFileSync(
      GetExtensionPath('extension/translation/control/en/switch.md'),
      'utf-8'
    ),
    while: readFileSync(
      GetExtensionPath('extension/translation/control/en/while.md'),
      'utf-8'
    ),
    on_ioerror: readFileSync(
      GetExtensionPath('extension/translation/control/en/on_ioerror.md'),
      'utf-8'
    ),
  },
};
