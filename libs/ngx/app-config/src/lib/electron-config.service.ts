import { inject, Injectable } from '@angular/core';
import {
  DEFAULT_ELECTRON_CONFIG,
  type IElectronConfig,
} from '@idl/types/electron';
import { BehaviorSubject } from 'rxjs';

import { ConfigApiService } from './config-api.service';

@Injectable({ providedIn: 'root' })
export class ElectronConfigService {
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

  private readonly configApi = inject(ConfigApiService);

  async init(): Promise<void> {
    const cfg = await this.configApi.getConfig();
    this._config$.next(cfg);
  }

  async set(patch: Partial<IElectronConfig>): Promise<void> {
    // PUT response is authoritative — no optimistic update needed
    const cfg = await this.configApi.updateConfig(patch);
    this._config$.next(cfg);
  }
}
