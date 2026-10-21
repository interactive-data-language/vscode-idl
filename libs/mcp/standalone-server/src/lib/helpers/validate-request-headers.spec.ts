import { ValidateRequestHeaders } from './validate-request-headers';

describe('ValidateRequestHeaders', () => {
  it('accepts undefined and string maps', () => {
    expect(ValidateRequestHeaders(undefined)).toBeUndefined();
    expect(ValidateRequestHeaders({ 'x-trace-id': 'abc' })).toBeUndefined();
  });

  it('rejects non-objects and non-string values', () => {
    expect(ValidateRequestHeaders('x')).toBeDefined();
    expect(ValidateRequestHeaders(null)).toBeDefined();
    expect(ValidateRequestHeaders([])).toBeDefined();
    expect(ValidateRequestHeaders({ 'x-a': 1 })).toBeDefined();
  });

  it('rejects transport-managed headers case-insensitively', () => {
    expect(ValidateRequestHeaders({ Host: 'evil' })).toBeDefined();
    expect(ValidateRequestHeaders({ 'Content-Length': '1' })).toBeDefined();
  });

  it('allows authorization so bearer tokens can reach the LLM', () => {
    expect(
      ValidateRequestHeaders({ Authorization: 'Bearer x' }),
    ).toBeUndefined();
  });
});
