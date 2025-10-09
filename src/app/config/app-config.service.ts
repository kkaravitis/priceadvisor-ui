import { Injectable } from '@angular/core';
import type { AppConfig } from './app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private cfg!: AppConfig;

  async load(): Promise<void> {
    const res = await fetch('app-config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Cannot load app-config.json');
    this.cfg = await res.json();
  }

  get config(): AppConfig {
    if (!this.cfg) throw new Error('AppConfig not loaded yet');
    return this.cfg;
  }
}