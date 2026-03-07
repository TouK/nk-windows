# AGENTS.md — nk-windows/docs (gh-pages)

> GitHub Pages deployment repo for [@touk/window-manager](https://github.com/TouK/nk-windows) Storybook.
> Live: https://touk.github.io/nk-windows
>
> This is the `gh-pages` branch of `TouK/nk-windows`. It contains **built artifacts only** —
> no source code, no build system, no tests. The actual source lives in `../code/` (branches `master`/`dev`).

## Repository Purpose

This repo stores versioned Storybook builds deployed via `@storybook/storybook-deployer`.
Each version directory (e.g. `v1.10.1/`, `v1.10.0-beta.8/`) contains a complete static
Storybook site. The `latest/` symlink points to the most recent stable build.

## Structure

```
docs/
├── index.html              # Version index page (auto-generated)
├── .scripts/
│   └── generateIndex.js    # Node script to regenerate index.html
├── latest/                 # Latest stable Storybook build
├── v1.10.1/                # Versioned builds (stable = bold in index)
├── v1.10.0-beta.8/         # Beta builds (normal weight in index)
└── .out/                   # Output directory for generateIndex.js
```

## Commands

### Regenerate version index

```bash
node .scripts/generateIndex.js
```

Scans root for version directories matching `/^[a-zA-Z].+$/`, sorts by `project.json` mtime,
and writes `index.html` to `.out/`. Beta versions are displayed with normal font-weight,
stable versions are bold.

### Deploying (done from ../code/)

Deployments are handled automatically by `semantic-release` on CI. Manual deploy:

```bash
# From ../code/ directory:
npm run build-storybook     # Build static Storybook
npm run deploy-storybook    # Deploy to gh-pages via storybook-deployer
```

## No Build/Lint/Test

This directory has **no** `package.json`, **no** dependencies, **no** linter, **no** tests.
The only executable is `.scripts/generateIndex.js` (plain Node.js, no dependencies).

## Code Style (for generateIndex.js)

The single script follows the conventions from the main codebase:

- **Language**: Plain JavaScript (CommonJS `require`)
- **Node APIs**: `node:fs`, `node:fs/promises`, `node:path` (prefixed imports)
- **Semicolons**: always
- **Quotes**: double quotes for strings
- **Indentation**: 2 spaces
- **Async/await** for file operations
- **Template literals** for HTML generation
- **`const`** by default; no `var`
- **Arrow functions** for callbacks and `.map()`/`.filter()`/`.sort()`
- Error handling: try/catch only where needed (e.g., checking directory existence)

## Main Codebase Reference

For the actual source code, build commands, and full style guide, see `../code/AGENTS.md`.
Key commands (run from `../code/`):

```bash
npm run build              # Rollup build -> cjs/ + esm/
npm run start              # Storybook dev server (port 6006)
npm run lint               # ESLint with --fix
npm run test:jest          # Jest unit tests
npx jest src/demo.spec.tsx # Single test file
npm run test:cypress:ci    # Cypress E2E (starts Storybook automatically)
```

## Tech Stack (main codebase)

- TypeScript 5.4, React 18, Emotion CSS-in-JS
- Jest + @testing-library/react (unit), Cypress (E2E + visual regression)
- Storybook 8 (CSF3), Rollup (CJS + ESM), semantic-release

## Git Workflow

- **Branch**: `gh-pages` (this repo checkout)
- **Commits**: automated deploy messages (`deploy: <commit-sha>`)
- **Do not** manually edit version directories — they are CI-generated artifacts
- **Do not** force-push — this branch is append-only
- `index.html` in root is the only file that may be manually regenerated
- `.nojekyll` must remain to disable Jekyll processing on GitHub Pages

## Notes for AI Agents

- This is a **static deployment repo** — almost never needs code changes
- The only modifiable files are `index.html` and `.scripts/generateIndex.js`
- Version directories are immutable build artifacts — never edit them
- If asked to update the index, run `node .scripts/generateIndex.js` then copy `.out/index.html` to root
- The source code, tests, and all development happen in `../code/` (or on `master`/`dev` branches)
- When working on this repo, there is no linter or formatter to run — just ensure consistency with existing style
- The `.gitignore` excludes `node_modules`, IDE files, `src/`, `cypress/`, and build outputs that belong to `../code/`
