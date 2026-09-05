import { TestBed } from '@angular/core/testing';

import { VSCodeService } from './vscode.service';

describe('VscodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VSCodeService = TestBed.get(VSCodeService);
    expect(service).toBeTruthy();
  });
});
