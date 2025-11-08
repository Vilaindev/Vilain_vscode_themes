# Repository Guidelines

## Project Structure & Module Organization
The VS Code extension lives at the repo root: `extension.js` wires activation commands, while static assets (webview HTML/CSS/JS) sit under `media/`. Keep additional assets inside `media/` so they can be declared in `localResourceRoots`. Version metadata and marketplace fields are defined in `package.json`; update them in tandem when cutting releases. There are no compiled artifacts in the repo—generated `.vsix` files should stay out of version control.

## Build, Test, and Development Commands
- `npm install` – restores the minimal runtime dependencies used by the extension host.
- `code --extensionDevelopmentPath="C:\\path\\to\\vilain-themepack-0.95"` – launches VS Code with this workspace injected for live testing (equivalent to pressing F5 in the VS Code extension debugging setup).
- `npx vsce package` – produces a distributable `.vsix`; run this after bumping the version and ensuring `README`/`changelog` assets are up to date.

## Coding Style & Naming Conventions
Author everything in modern JavaScript (CommonJS modules). Use 2-space indentation, double quotes for strings, and trailing commas only where valid in Node 16+. Keep activation functions pure and side-effect free except for VS Code registrations, and wrap user-facing operations in try/catch with `vscode.window.showErrorMessage`. Name commands with the `vilain.*` prefix, store assets in lowercase files (`media/welcome.css`), and prefer concise arrow functions for inline handlers.

## Testing Guidelines
Manual testing happens via the Extension Development Host: load the workspace, trigger `VILAIN: Ouvrir la page de bienvenue`, and verify the buttons send the right messages (theme switches, external links). When adding webview assets, confirm the CSP string includes every new resource type and that `media/` references go through `asWebviewUri`. For regression safety, smoke-test at least three built-in themes and validate console output in the DevTools panel. Target 100% execution of new branches; if logic becomes complex, consider extracting pure helpers and covering them with lightweight unit tests using `node --test`.

## Commit & Pull Request Guidelines
Follow imperative, present-tense commit subjects (e.g., `Fix welcome panel CSP`). Group related file changes per commit and mention the VS Code version requirement when it shifts. Pull requests should summarize motivation, list manual test steps (`vsce package`, Dev Host scenarios), and link to any tracked issues or screenshots of UI tweaks. Request at least one reviewer before merging and ensure the branch rebases cleanly onto the main line to avoid packaging drift.
