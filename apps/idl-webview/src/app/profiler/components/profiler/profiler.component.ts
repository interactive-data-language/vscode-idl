import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IProfilerItem } from '@idl/debug-types';

import { VSCodeService } from '../../../services/services/vscode.service';

/**
 * Regular expression for routines to filter out from profiling
 */
const VSCODE_REGEX = /^vscode_/i;

@Component({
  selector: 'idlwv-profiler',
  templateUrl: './profiler.component.html',
  styleUrls: ['./profiler.component.scss'],
})
export class ProfilerComponent implements OnInit {
  /** Current profiler string from IDL */
  profilerString = '';

  /** Current profiler data, parsed version of string */
  profilerData: IProfilerItem[] = [];

  /** Columns of profiler data that we display */
  displayedColumns = ['r', 'n', 't', 't_s', 'l_r', 'l_t'];

  /** Total time we have spent profiling code */
  totalTime = 1;

  /** Table data source */
  dataSource = new MatTableDataSource(this.profilerData);

  /** Sort controls for table */
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  /** vscode component for filtering table */
  @ViewChild('filterInput') someInput!: ElementRef;

  // track timer for filer when typing
  private timeout?: number;

  constructor(private vscode: VSCodeService) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;

    // TODO: unsubscribe when component changes to prevent memory leaks
    // but the window gets created/destroyed, and small data volume, so not
    // end of the world right now
    this.vscode.profiler.subscribe((message) => {
      this.profilerString = message.data;
      this.profilerData = JSON.parse(this.profilerString);

      // update total time and map times to ms from seconds
      let newTime = 0;
      for (let i = 0; i < this.profilerData.length; i++) {
        this.profilerData[i].t = Round(this.profilerData[i].t * 1000);
        this.profilerData[i].t_s = Round(this.profilerData[i].t_s * 1000);

        // track total time
        newTime += this.profilerData[i].t;
      }
      this.totalTime = newTime;

      // update table data source
      this.dataSource.data = this.profilerData;
    });
  }

  /**
   * Sort table based on which column and how it is clicked
   */
  sortData(sort: Sort) {
    // return if nothing to do
    if (!sort.active || sort.direction === '') {
      return;
    }

    // set data and sort
    this.dataSource.data = this.profilerData.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        default:
          return compare(a[sort.active], b[sort.active], isAsc);
      }
    });
  }

  /**
   * Applies our filter to the list of profiled entities
   */
  applyFilter(event: KeyboardEvent) {
    // if there is already a timeout in process cancel it
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    // get value of our search filter
    const filterValue = this.someInput.nativeElement.value;

    // set new timeout before applying the filter
    this.timeout = window.setTimeout(() => {
      this.timeout = undefined;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }, 500);
  }
}

/**
 * Sorts two elements WRT one another, from angular docs
 */
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

/**
 * Takes a value and rounds it to the nearest number of decimal places
 */
function Round(val: number, decimals = 6): number {
  return +val.toFixed(decimals);
}
