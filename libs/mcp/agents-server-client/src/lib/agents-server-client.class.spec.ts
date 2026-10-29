import type { ChatStreamChunk } from '@idl/types/chat';
import axios from 'axios';
import { createServer, type Server } from 'http';
import type { AddressInfo } from 'net';

import { AgentsServerClient } from './agents-server-client.class';

/**
 * Reads the whole request body
 */
function ReadBody(req: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => resolve(body));
  });
}

describe('AgentsServerClient', () => {
  let server: Server;
  let client: AgentsServerClient;
  let mcpAsSSE = false;
  const cancelled: string[] = [];

  beforeAll(async () => {
    server = createServer(async (req, res) => {
      const body = await ReadBody(req);

      if (req.url === '/api/chat/models') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ models: [], defaultModelID: 'm' }));
      } else if (req.url === '/api/chat/example-prompts') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ prompts: [] }));
      } else if (req.url === '/api/config' && req.method === 'PUT') {
        res.setHeader('Content-Type', 'application/json');
        res.end(body);
      } else if (req.url?.endsWith('/cancel')) {
        cancelled.push(req.url.split('/')[3]);
        res.statusCode = 204;
        res.end();
      } else if (req.url === '/api/chat/message') {
        const request = JSON.parse(body);
        if (request.message === 'fail') {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'bad' }));
          return;
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(': keepalive\n\n');
        res.write(
          `data: ${JSON.stringify({ type: 'text_chunk', content: 'a' })}\n\n`,
        );
        if (request.message === 'error') {
          res.write(
            `data: ${JSON.stringify({ type: 'error', error: 'boom' })}\n\n`,
          );
        } else {
          res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
          res.write(
            `data: ${JSON.stringify({ type: 'title', title: 'T' })}\n\n`,
          );
        }
        res.end();
      } else if (req.url === '/mcp') {
        const rpc = JSON.parse(body);
        const msg = JSON.stringify(
          rpc.params.name === 'bad'
            ? { jsonrpc: '2.0', id: rpc.id, error: { message: 'nope' } }
            : {
                jsonrpc: '2.0',
                id: rpc.id,
                result: {
                  content: [{ type: 'text', text: JSON.stringify(rpc.params) }],
                  isError: false,
                },
              },
        );
        if (mcpAsSSE) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.end(`event: message\ndata: ${msg}\n\n`);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(msg);
        }
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    client = new AgentsServerClient({
      axios: axios.create(),
      baseUrl: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    });
  });

  afterAll(
    () =>
      new Promise<void>((r) => {
        server.closeAllConnections();
        server.close(() => setTimeout(r, 100));
      }),
  );

  const request = (message: string) => ({
    message,
    model: 'm',
    sessionId: 's1',
    conversationHistory: [],
  });

  it('returns typed payloads for JSON routes', async () => {
    expect((await client.getModels()).defaultModelID).toBe('m');
    expect(await client.getExamplePrompts()).toEqual({ prompts: [] });
    expect(await client.putConfig({ a: 1 })).toEqual({ a: 1 });
    await client.cancelSession('s 1');
    expect(cancelled).toEqual(['s%201']);
  });

  it('streams chunks unchanged, including the title after done', async () => {
    const chunks: ChatStreamChunk[] = [];
    await client.postMessage(request('hi') as any, (c) => chunks.push(c));
    expect(chunks.map((c) => c.type)).toEqual(['text_chunk', 'done', 'title']);
  });

  it('passes error chunks through and rejects on HTTP errors', async () => {
    const chunks: ChatStreamChunk[] = [];
    await client.postMessage(request('error') as any, (c) => chunks.push(c));
    expect(chunks.map((c) => c.type)).toEqual(['text_chunk', 'error']);
    await expect(
      client.postMessage(request('fail') as any, () => undefined),
    ).rejects.toThrow();
  });

  it('calls MCP tools with JSON and SSE responses', async () => {
    for (const sse of [false, true]) {
      mcpAsSSE = sse;
      const resp = await client.callMCPTool('list-skills' as any, {} as any);
      expect(resp.isError).toBe(false);
      expect(JSON.parse((resp.content[0] as any).text).name).toBe(
        'list-skills',
      );
    }
    await expect(client.callMCPTool('bad' as any, {} as any)).rejects.toThrow(
      'nope',
    );
  });
});
