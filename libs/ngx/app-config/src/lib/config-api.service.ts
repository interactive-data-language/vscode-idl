import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  DEFAULT_ELECTRON_CONFIG,
  type IElectronConfig,
  type IServerConfig,
} from '@idl/types/electron';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

/**
 * Service for retrieving/updating server config via the REST API
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigApiService {
  private readonly _config$ = new BehaviorSubject<IElectronConfig>(
    DEFAULT_ELECTRON_CONFIG,
  );

  readonly config$ = this._config$.asObservable();

  /** True when running inside the Electron shell */
  readonly isElectron =
    typeof window !== 'undefined' && window.electron !== undefined;

  get config(): IElectronConfig {
    return this._config$.value;
  }

  /** HTTP client */
  private readonly http = inject(HttpClient);

  /** Cached host/port lookup so we only ask the main process once */
  private serverInfoPromise: Promise<IServerConfig> | undefined;

  /**
   * Fetch the current server configuration and store it as the active config
   */
  async init(): Promise<void> {
    const url = await this.baseUrl();
    const cfg = await firstValueFrom(this.http.get<IElectronConfig>(url));
    this._config$.next(cfg);
  }

  /**
   * Submit a partial update and store the authoritative, merged configuration
   */
  async set(patch: Partial<IElectronConfig>): Promise<void> {
    const url = await this.baseUrl();
    // PUT response is authoritative — no optimistic update needed
    const cfg = await firstValueFrom(
      this.http.put<IElectronConfig>(url, patch),
    );
    this._config$.next(cfg);
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
