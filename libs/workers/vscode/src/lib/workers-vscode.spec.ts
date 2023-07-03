import { workersVscode } from './workers-vscode';

describe('workersVscode', () => {
  it('should work', () => {
    expect(workersVscode()).toEqual('workers-vscode');
  });
});
