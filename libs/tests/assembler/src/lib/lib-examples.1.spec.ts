import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify code snippets from the lib folder`, () => {
  it(`[auto generated] cw_ogc_wcs_cap.pro 1`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `subsel = make_array(2, numRows, /byte)  ; an array to hold the unique values`,
      `subsel[0,0] = sel[*,1]`,
      `lastRow = sel[1,0]`,
      `ri = 1`,
      ``,
      `;filter out all the rows that repeat`,
      `for i=1, cnt-1 do begin`,
      `   if (lastRow ne sel[1,i]) then begin`,
      `      sel[0,i] = 1`,
      `      subsel[*,ri] = sel[*,i]`,
      `      lastRow = sel[1,i]`,
      `      ri++`,
      `    endif`,
      `endfor`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `subsel = make_array(2, numRows, /byte) ; an array to hold the unique values`,
        `subsel[0, 0] = sel[*, 1]`,
        `lastRow = sel[1, 0]`,
        `ri = 1`,
        ``,
        `; filter out all the rows that repeat`,
        `for i = 1, cnt - 1 do begin`,
        `  if (lastRow ne sel[1, i]) then begin`,
        `    sel[0, i] = 1`,
        `    subsel[*, ri] = sel[*, i]`,
        `    lastRow = sel[1, i]`,
        `    ri++`,
        `  endif`,
        `endfor`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 99,
        info: 'Undefined variable "numRows"',
        start: [1, 23, 7],
        end: [1, 23, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sel"',
        start: [2, 14, 3],
        end: [2, 14, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sel"',
        start: [3, 10, 3],
        end: [3, 10, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "cnt"',
        start: [7, 9, 3],
        end: [7, 9, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sel"',
        start: [8, 18, 3],
        end: [8, 18, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sel"',
        start: [9, 6, 3],
        end: [9, 6, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sel"',
        start: [10, 21, 3],
        end: [10, 21, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sel"',
        start: [11, 16, 3],
        end: [11, 16, 3],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] cw_ogc_wcs_cap.pro 2`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      ``,
      `if ((*pstate).mouseState eq 1) then begin`,
      ``,
      `    if (totCOBs gt rows) then begin`,
      `       if ((*pstate).scrollUp eq 0) then begin  ; scroll down`,
      `          if ((*pstate).cobIndex lt totCOBs) then begin`,
      ``,
      ``,
      `             (*pstate).cobIndex = (*pstate).cobIndex + (*pstate).pageScrlInc`,
      ``,
      `             idx   = (*pstate).cobIndex`,
      `             skip  = idx-rows`,
      `             if (skip gt (totCOBs - rows)) then begin`,
      `                skip = totCOBs - rows`,
      `                ;(*pstate).cobIndex = totCOBs-rows`,
      `                (*pstate).cobIndex = totCOBs`,
      `             endif`,
      ``,
      `             res   = (*pstate).owcs->GetCoverageOfferingBriefs(index=skip, number=rows)`,
      `             cw_ogc_wcs_cap_display_cap_table, ev, res`,
      ``,
      `           endif`,
      `       endif else begin  ; scroll up`,
      `          if ((*pstate).cobIndex gt rows) then begin`,
      ``,
      ``,
      `             (*pstate).cobIndex =  (*pstate).cobIndex - (*pstate).pageScrlInc`,
      ``,
      `             idx   = (*pstate).cobIndex`,
      `             skip  = idx-rows`,
      ``,
      `             if (skip lt 0) then begin`,
      `                skip = 0`,
      `                (*pstate).cobIndex = rows`,
      `             endif`,
      ``,
      `             res   = (*pstate).owcs->GetCoverageOfferingBriefs(index=skip, number=rows)`,
      `             cw_ogc_wcs_cap_display_cap_table, ev, res`,
      ``,
      `           endif`,
      `       endelse`,
      `    endif`,
      `endif`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `if ((*pstate).mouseState eq 1) then begin`,
        `  if (totCOBs gt rows) then begin`,
        `    if ((*pstate).scrollUp eq 0) then begin ; scroll down`,
        `      if ((*pstate).cobIndex lt totCOBs) then begin`,
        `        (*pstate).cobIndex = (*pstate).cobIndex + (*pstate).pageScrlInc`,
        ``,
        `        idx = (*pstate).cobIndex`,
        `        skip = idx - rows`,
        `        if (skip gt (totCOBs - rows)) then begin`,
        `          skip = totCOBs - rows`,
        `          ; (*pstate).cobIndex = totCOBs-rows`,
        `          (*pstate).cobIndex = totCOBs`,
        `        endif`,
        ``,
        `        res = (*pstate).owcs.getCoverageOfferingBriefs(index = skip, number = rows)`,
        `        cw_ogc_wcs_cap_display_cap_table, ev, res`,
        `      endif`,
        `    endif else begin ; scroll up`,
        `      if ((*pstate).cobIndex gt rows) then begin`,
        `        (*pstate).cobIndex = (*pstate).cobIndex - (*pstate).pageScrlInc`,
        ``,
        `        idx = (*pstate).cobIndex`,
        `        skip = idx - rows`,
        ``,
        `        if (skip lt 0) then begin`,
        `          skip = 0`,
        `          (*pstate).cobIndex = rows`,
        `        endif`,
        ``,
        `        res = (*pstate).owcs.getCoverageOfferingBriefs(index = skip, number = rows)`,
        `        cw_ogc_wcs_cap_display_cap_table, ev, res`,
        `      endif`,
        `    endelse`,
        `  endif`,
        `endif`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [1, 0, 2],
        end: [1, 0, 2],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [1, 6, 6],
        end: [1, 6, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "totCOBs"',
        start: [2, 8, 7],
        end: [2, 8, 7],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "rows"',
        start: [2, 19, 4],
        end: [2, 19, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [3, 13, 6],
        end: [3, 13, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [4, 16, 6],
        end: [4, 16, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "totCOBs"',
        start: [4, 36, 7],
        end: [4, 36, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [5, 15, 6],
        end: [5, 15, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [5, 36, 6],
        end: [5, 36, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [5, 57, 6],
        end: [5, 57, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [7, 23, 6],
        end: [7, 23, 6],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "rows"',
        start: [8, 25, 4],
        end: [8, 25, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "totCOBs"',
        start: [9, 26, 7],
        end: [9, 26, 7],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "rows"',
        start: [9, 36, 4],
        end: [9, 36, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "totCOBs"',
        start: [10, 23, 7],
        end: [10, 23, 7],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "rows"',
        start: [10, 33, 4],
        end: [10, 33, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [12, 18, 6],
        end: [12, 18, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "totCOBs"',
        start: [12, 37, 7],
        end: [12, 37, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [15, 23, 6],
        end: [15, 23, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [19, 16, 6],
        end: [19, 16, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [20, 15, 6],
        end: [20, 15, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [20, 37, 6],
        end: [20, 37, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [20, 58, 6],
        end: [20, 58, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [22, 23, 6],
        end: [22, 23, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [27, 18, 6],
        end: [27, 18, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [30, 23, 6],
        end: [30, 23, 6],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
