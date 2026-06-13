# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Angular 19 (standalone components, no NgModules) personal portfolio site, styled with Tailwind CSS v4 + Preline UI, internationalized with `@ngneat/transloco` (Spanish default, English available). Deployed to GitHub Pages.

## Commands

- `npm start` / `ng serve` - run the dev server at `http://localhost:4200/`
- `ng build` - production build (output to `dist/portfolio-angular`, base href `/portfolio/`)
- `npm test` / `ng test` - run unit tests with Karma/Jasmine
- `ng generate component components/<name>` - scaffold a new standalone component (matches existing structure)

There is no lint script configured.

## Architecture

- **Standalone components only**: every component declares its own `imports: [...]` array (no NgModules). `AppComponent` composes `HeaderComponent`, `ContentComponent`, and `FooterComponent`.
- **Component layout**: each component lives in `src/app/components/<name>/` with `.ts`, `.html`, and `.css` files (`templateUrl`/`styleUrl`, not inline).
- **`ContentComponent`** (`src/app/components/content/`) is the page body and composes the section components in order: `ProfileComponent`, `ExperienceComponent`, `ProjectsComponent`, `SkillsComponent`, `AcademicEducationComponent`, `EducationComponent` (certificates carousel).
- **Routing**: `src/app/app.routes.ts` is currently empty — this is a single-page layout, not a multi-route app.
- **i18n via Transloco**:
  - Config is inline in `app.config.ts` via `provideTransloco({...})` (`availableLangs: ['es', 'en']`, `defaultLang: 'es'`, `reRenderOnLangChange: true`).
  - Translations are loaded over HTTP from `src/assets/i18n/{lang}.json` via `TranslocoHttpLoader` (`src/app/transloco-loader.ts`).
  - Components that render translated text import `TranslocoModule` and use the transloco pipe/directives in templates.
  - **When adding or changing UI copy, update both `src/assets/i18n/en.json` and `src/assets/i18n/es.json`** — keys must stay in sync between the two files. Sections are keyed by component area (`header`, `profile`, `experience`, `projects`, `skills`, `academicEducation`, `education`).
  - `HeaderComponent` (`src/app/components/header/header.component.ts`) handles language switching via `TranslocoService.setActiveLang`, with a segmented ES/EN control driven by the `activeLang` property.
- **Dark mode**:
  - `ThemeService` (`src/app/services/theme.service.ts`) is a signal-based (`isDark` signal), `providedIn: 'root'` service. It toggles the `dark` class on `document.documentElement`, persists the choice to `localStorage` (`theme` key), and falls back to `prefers-color-scheme` on first load.
  - Tailwind v4's dark variant is enabled via `@custom-variant dark (&:where(.dark, .dark *));` in `src/styles.css` — class-based, not media-query-based.
  - `HeaderComponent` injects `ThemeService` (as `theme`) and renders the toggle button; every section component pairs light-mode utility classes with `dark:` variants (commonly `dark:bg-neutral-800/900`, `dark:text-gray-100/300/400`, `dark:border-neutral-700`).
  - Accent color is teal/emerald (`teal-500`/`teal-600`, etc.) — keep new UI consistent with this palette in both light and dark variants.
- **Preline UI**: loaded as a global script (`node_modules/preline/dist/index.js`, see `angular.json`) and re-initialized after route navigation via `window.HSStaticMethods.autoInit()` in `AppComponent.ngOnInit`. The `window.HSStaticMethods` type declaration lives in `src/global.d.ts`.
- **Styling**: Tailwind v4 is configured via PostCSS plugins (`.postcssrc.json`: `@tailwindcss/postcss`, plus `@tailwindcss/forms`), imported in `src/styles.css`. No `tailwind.config.js` — Tailwind v4 CSS-first config.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and deploys to GitHub Pages via `angular-cli-ghpages` (`ng deploy --base-href=/portfolio/`), targeting `github.com/juanifabrega/portfolio.git`.
