import * as Net from 'net';
import * as vscode from 'vscode';

import { IDLDebugAdapter } from './idl-debug-adapter.class';

export class ServerIDLDebugAdapterFactory
  implements vscode.DebugAdapterDescriptorFactory
{
  session: IDLDebugAdapter;
  private server?: Net.Server;

  constructor() {
    const session = new IDLDebugAdapter();
    this.session = session;
  }

  createDebugAdapterDescriptor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    session: vscode.DebugSession,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executable: vscode.DebugAdapterExecutable | undefined
  ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    if (!this.server) {
      // start listening on a random port
      this.server = Net.createServer((socket) => {
        this.session.setRunAsServer(true);
        this.session.start(socket as NodeJS.ReadableStream, socket);
      }).listen(0);
    }

    // make VS Code connect to debug server
    return new vscode.DebugAdapterServer(
      (this.server.address() as Net.AddressInfo).port
    );
  }

  dispose() {
    if (this.server) {
      this.server.close();
    }
  }
}
