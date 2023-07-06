import {
  IDL_ANY_TYPE,
  IDL_BOOLEAN_TYPE,
  IDL_NUMBER_TYPE,
  IDL_STRING_TYPE,
  ParseIDLType,
} from '@idl/data-types/core';

import { IProcedureOverride } from '../detail.interface';

/**
 * Overrides for procedure metadata when generating internal docs
 */
export const PROCEDURE_OVERRIDE: IProcedureOverride = {
  cd: {
    args: {},
    kws: {
      current: {
        direction: 'out',
        type: IDL_STRING_TYPE,
      },
    },
  },
  defsysv: {
    args: {},
    kws: {
      exists: {
        direction: 'out',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  help: {
    args: {},
    kws: {
      output: {
        direction: 'out',
        type: ParseIDLType('Array<String>'),
      },
    },
  },
  la_ludc: {
    args: {},
    kws: {
      interchanges: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  loadct: {
    args: {},
    kws: {
      rgb_table: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
    },
  },
  map_set: {
    args: {},
    kws: {
      position: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
    },
  },
  openr: {
    args: {
      unit: {
        direction: 'bidirectional',
        type: IDL_NUMBER_TYPE,
      },
      file: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      block: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      stream: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  openw: {
    args: {
      unit: {
        direction: 'bidirectional',
        type: IDL_NUMBER_TYPE,
      },
      file: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      block: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      initial: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      maccreator: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      mactype: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      stream: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  openu: {
    args: {
      unit: {
        direction: 'bidirectional',
        type: IDL_NUMBER_TYPE,
      },
      file: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      block: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  print: {
    args: {
      expressioni: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      am_pm: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      days_of_the_week: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      format: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      implied_print: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      months: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      stdio_non_finite: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  printf: {
    args: {
      unit: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      expressioni: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      am_pm: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      days_of_the_week: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      format: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      implied_print: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      months: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      stdio_non_finite: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  read: {
    args: {
      vari: {
        direction: 'out',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      am_pm: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      days_of_the_week: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      format: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      months: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      prompt: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  readf: {
    args: {
      unit: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      vari: {
        direction: 'out',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      am_pm: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      days_of_the_week: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      format: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      months: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
    },
  },
};
