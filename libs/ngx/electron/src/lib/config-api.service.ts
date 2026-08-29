import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { IElectronConfig } from '@idl/types/electron';
import { firstValueFrom } from 'rxjs';

/**
 * Service for retrieving/updating server config via the REST API
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigApiService {
  /** HTTP client */
  private readonly http = inject(HttpClient);

  /** True when running inside the Electron shell */
  private readonly isElectron =
    typeof window !== 'undefined' && window.electron !== undefined;

  /** Cached host/port lookup so we only ask the main process once */
  private serverInfoPromise:
    | Promise<{ host: string; port: number }>
    | undefined;

  /**
   * Fetch the current server configuration
   */
  async getConfig(): Promise<IElectronConfig> {
    const url = await this.baseUrl();
    return firstValueFrom(this.http.get<IElectronConfig>(url));
  }

  /**
   * Submit a partial update and return the authoritative, merged configuration
   */
  async updateConfig(
    patch: Partial<IElectronConfig>,
  ): Promise<IElectronConfig> {
    const url = await this.baseUrl();
    return firstValueFrom(this.http.put<IElectronConfig>(url, patch));
  }

  /**
   * Base URL for the REST API — resolved via IPC bootstrap when running in
   * Electron (the server's port is assigned dynamically), relative otherwise
   */
  private async baseUrl(): Promise<string> {
    if (!this.isElectron || !window.electron) {
      return '/api/config';
    }

    if (!this.serverInfoPromise) {
      this.serverInfoPromise = window.electron.getServerInfo();
    }

    const { host, port } = await this.serverInfoPromise;
    return `http://${host}:${port}/api/config`;
  }
}
