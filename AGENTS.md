# AGENTS.md — @touk/window-manager

> Window manager React component library used in [Nussknacker](https://nussknacker.io).
> Demo: https://touk.github.io/nk-windows

## Build & Run

```bash
npm run build          # Rollup build → cjs/ + esm/
npm run start          # Start Storybook dev server (port 6006)
npm run build-storybook # Build static Storybook
```

## Lint

```bash
npm run lint           # ESLint with --fix on src/**/*.{js,ts,tsx}
```

ESLint config: `.eslintrc` — TypeScript parser, react/react-hooks/prettier plugins.

## Test Commands

```bash
npm test               # Full coverage pipeline (jest + cypress)
npm run test:jest      # Jest unit tests only

# Run a single test file:
npx jest src/demo.spec.tsx
npx jest --testPathPattern="demo"

# Cypress E2E (requires Storybook running on :6006):
npm run test:cypress:dev   # Interactive (cypress open)
npm run test:cypress       # Headless (cypress run)
npm run test:cypress:ci    # Starts Storybook + runs Cypress
```

Jest config: `jest.config.js` — ts-jest, jsdom env, tests matched by `(test|spec)\.tsx?$` in `src/`.

## Tech Stack

- **Node.js**: v18.12.1 (see `.nvmrc`)
- **TypeScript** 5.4, **React** 18 (peer dep: ^17 || ^18)
- **Styling**: @emotion/css + @emotion/react + @emotion/styled (CSS-in-JS)
- **State**: Custom reducer + thunk pattern (no Redux), reselect for selectors
- **Window lib**: react-rnd (resize & drag)
- **Testing**: Jest + @testing-library/react (unit), Cypress (E2E + visual regression)
- **Storybook** 8 (CSF3 format)
- **Bundler**: Rollup (CJS + ESM dual output)
- **Release**: semantic-release on `master` (stable) and `dev` (beta)

## Project Structure

```
src/
├── index.ts                    # Public API exports
├── types.ts                    # Core types (WindowType, WindowId, etc.)
├── AppTheme.ts                 # Theme type + @emotion/react module augmentation
├── components/
│   ├── WindowManager.tsx       # Top-level provider component
│   ├── WindowsContainer.tsx    # Renders windows via portal
│   ├── WindowsViewport.tsx     # Viewport wrapper
│   └── window/                 # Window internals (Frame, Header, Footer, Content)
├── context/                    # React context for window manager state
├── hooks/                      # Public hooks (useWindowManager, useWindowZoom, etc.)
├── store/                      # Reducer, actions, selectors (thunk-based)
├── demo/                       # Demo components for Storybook
├── demo.tsx                    # Main demo entry
├── demo.stories.tsx            # Storybook story (CSF3)
└── demo.spec.tsx               # Jest test
mocks/                          # Jest module mocks (SVG, CSS, color-alpha)
cypress/                        # Cypress E2E tests + visual regression snapshots
```

## Code Style

### Formatter — Prettier

Config in `.prettierrc`:
- Semicolons: **always**
- Trailing commas: **all** (including function params)
- Print width: **140**

### Imports

- External packages first, then internal modules with relative paths
- No blank line separating external/internal groups (single block)
- Named imports preferred: `import { foo } from "bar"`
- React imported as default: `import React, { useState, useCallback } from "react"`
- Type-only imports with `import type` when only types are needed (e.g., stories)
- Lodash: mix of `import { x } from "lodash"` and `import { x } from "lodash/fp"`

### TypeScript

- Strict-ish config: `esModuleInterop`, `allowSyntheticDefaultImports`, target ES5
- **Interfaces** for component props and object shapes: `interface WindowProps { ... }`
- **Type aliases** for unions, mapped types, and simple aliases: `type WindowId = string`
- Generics used extensively: `WindowType<Kind, Meta>`, `ThunkAction<R, T>`
- Discriminated unions for actions: `type Action = { type: "OPEN_WINDOW"; ... } | ...`
- `Partial<>` and `Record<>` utility types used frequently
- No explicit return types on React components — inferred JSX
- Explicit return types on hooks and utility functions when non-trivial
- `@deprecated` JSDoc tag for deprecated props

### Naming Conventions

- **Components**: PascalCase (`WindowFrame`, `ModalMask`)
- **Hooks**: camelCase with `use` prefix (`useWindowManager`, `useFrameTheme`)
- **Types/Interfaces**: PascalCase (`WindowType`, `ContentGetter`, `WindowFrameProps`)
- **Props interfaces**: `ComponentNameProps` pattern (`WindowFrameProps`, `WindowsContainerProps`)
- **Constants**: UPPER_SNAKE_CASE (`DRAG_HANDLE_CLASS_NAME`, `DRAG_PREVENT_CLASS_NAME`)
- **Files**: PascalCase for components (`WindowFrame.tsx`), camelCase for utilities/hooks (`windowHooks.ts`, `selectors.ts`)
- **Actions**: UPPER_SNAKE_CASE strings (`"OPEN_WINDOW"`, `"CLOSE_WINDOW"`)
- **SVGs**: lowercase (`close.svg`, `zoom.svg`)
- Barrel re-exports via `index.ts` in subdirectories

### React Patterns

- **Functional components only** — no class components
- `forwardRef` for components that expose DOM refs, with `displayName` set
- Heavy use of `useCallback` and `useMemo` for memoization
- Custom hooks extract complex logic from components
- Context-based state management (not Redux)
- Portals for rendering windows into `document.body`
- `react-transition-group` for enter/exit animations

### Styling (Emotion CSS-in-JS)

- `css()` from `@emotion/css` for class generation (not styled-components pattern)
- `cx()` for merging CSS classes
- `useTheme()` from `@emotion/react` for theme access in hooks
- Theme type augmented in `AppTheme.ts` via `declare module "@emotion/react"`
- CSS objects (not template literals): `css({ display: "flex", zIndex })`

### Error Handling

- Context hooks throw descriptive errors when used outside providers:
  `throw new Error("used outside WindowManager")`
- No try/catch in most code — errors propagate naturally
- Null-safe access with optional chaining (`?.`) prevalent

### Export Patterns

- Named exports preferred over default exports
- `src/index.ts` is the public API — re-exports only what consumers need
- Barrel `index.ts` files in subdirectories for internal grouping
- `export *` avoided except for namespace exports (`export * as DefaultComponents`)

### Tests

- **Jest + @testing-library/react** for unit tests
- Pattern: render component → query with `screen` → assert with `jest-dom` matchers
- Files: `*.spec.tsx` next to source files in `src/`
- **Cypress** for E2E + visual regression (via `@frsource/cypress-plugin-visual-regression-diff`)
- Storybook stories serve as Cypress test targets (baseUrl: `localhost:6006`)

### Storybook

- CSF3 format: `Meta` + `StoryObj` types
- `satisfies Meta<typeof Component>` pattern for type safety
- Files: `*.stories.tsx` next to source files

## Notes for AI Agents

- The public API surface is defined in `src/index.ts` — do not add exports without intent
- Dual CJS/ESM build — test both output formats if changing module structure
- `patches/` directory contains patch-package patches — check after dependency updates
- Visual regression snapshots in `cypress/` — update with `npm run test:cypress:ci:update`
- `postinstall` runs `patch-package` automatically
