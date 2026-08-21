import { Injectable } from '@angular/core';
import {
  DEFAULT_ELECTRON_CONFIG,
  type IElectronConfig,
} from '@idl/types/electron';
import { BehaviorSubject } from 'rxjs';

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

  async init(): Promise<void> {
    if (!this.isElectron || !window.electron) return;
    const cfg = await window.electron.getConfig();
    this._config$.next(cfg);
    window.electron.onConfigChanged((updated) => this._config$.next(updated));
  }

  async set(patch: Partial<IElectronConfig>): Promise<void> {
    if (!window.electron) return;
    // optimistic update; main process will push the authoritative value back
    this._config$.next({ ...this._config$.value, ...patch });
    await window.electron.setConfig(patch);
  }
}
