import { IHoverHelpTranslations } from '../../translation.interface';
import { BREAK } from './hover-help/break';
import { CASE } from './hover-help/case';
import { CONTINUE } from './hover-help/continue';
import { ELSE } from './hover-help/else';
import { FOR } from './hover-help/for';
import { FOREACH } from './hover-help/foreach';
import { FUNCTION } from './hover-help/function';
import { IF } from './hover-help/if';
import { ON_IOERROR } from './hover-help/on_ioerror';
import { PRO } from './hover-help/pro';
import { SWITCH } from './hover-help/switch';
import { WHILE } from './hover-help/while';

/**
 * English translations for custom hover help
 */
export const HOVER_HELP_EN: IHoverHelpTranslations = {
  control: {
    break: BREAK.trim(),
    case: CASE.trim(),
    continue: CONTINUE.trim(),
    else: ELSE.trim(),
    for: FOR.trim(),
    foreach: FOREACH.trim(),
    function: FUNCTION.trim(),
    if: IF.trim(),
    pro: PRO.trim(),
    switch: SWITCH.trim(),
    while: WHILE.trim(),
    on_ioerror: ON_IOERROR.trim(),
  },
};
