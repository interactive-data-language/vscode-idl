import { existsSync, mkdirSync, rmSync } from 'fs';
import { nanoid } from 'nanoid';
import { tmpdir } from 'os';
import { join } from 'path';
import { Socket } from 'socket.io';

export class IDLTempFolderManager {
  /** Track temp folders by the ID of teh socket connection */
  foldersByID: { [key: string]: string } = {};

  /** Root folder where all temp things like */
  root = join(tmpdir(), 'idl-ws-temp');

  constructor() {
    // delete temp folder if it exists
    if (existsSync(this.root)) {
      rmSync(this.root, { recursive: true, force: true });
    }

    // make the folder
    mkdirSync(this.root, { recursive: true });
  }

  /**
   * Create temp folder for socket connection and return the
   * path
   */
  createTempFolder(socket: Socket): string {
    /**
     * Temp directory
     */
    const tempDir = join(this.root, nanoid());

    // make temp folder
    mkdirSync(tempDir, { recursive: true });

    // save
    this.foldersByID[socket.id] = tempDir;

    // return
    return tempDir;
  }

  /**
   * Remove the temp folder for a socket connection
   */
  removeTempFolder(socket: Socket) {
    if (socket.id in this.foldersByID) {
      rmSync(this.foldersByID[socket.id], { recursive: true, force: true });
    }
    delete this.foldersByID[socket.id];
  }
}
