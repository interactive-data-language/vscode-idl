import {
  ChatService,
  CreateIDLMachineBackend,
  CreateStandaloneMCPServer,
  MCPClient,
  StartAgentsServer,
  validateEnv,
} from './mcp-standalone-server';

describe('mcp-standalone-server exports', () => {
  it('should export StartAgentsServer as a function', () => {
    expect(typeof StartAgentsServer).toBe('function');
  });

  it('should export CreateStandaloneMCPServer as a function', () => {
    expect(typeof CreateStandaloneMCPServer).toBe('function');
  });

  it('should export CreateIDLMachineBackend as a function', () => {
    expect(typeof CreateIDLMachineBackend).toBe('function');
  });

  it('should export ChatService as a class', () => {
    expect(typeof ChatService).toBe('function');
  });

  it('should export MCPClient as a class', () => {
    expect(typeof MCPClient).toBe('function');
  });

  it('should export validateEnv as a function', () => {
    expect(typeof validateEnv).toBe('function');
  });
});
