import { Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(this.resolveInitialTheme());

  constructor() {
    this.applyTheme(this.isDark());
  }

  toggle(): void {
    this.isDark.update(value => !value);
    this.applyTheme(this.isDark());
  }

  private resolveInitialTheme(): boolean {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }
}
