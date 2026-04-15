# MCP: IDL Machine

Library to launch and interact with the IDL through MCP.

```typescript
import { IDLMCPExecutionManager } from '@idl/mcp/idl-machine';

const manager = new IDLMCPExecutionManager(myLogger, '/path/to/pro', {
  onReadIOLine: async (prompt) => { /* return user input */ return ''; }
});

const started = await manager.launch('Starting IDL', {
  config: { IDL: { directory: '/path/to/idl/bin' }, ... },
  env: process.env,
});

if (started) {
  const output = await manager.evaluate('print, 42');
}
```
