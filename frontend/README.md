# Frontend — React + TypeScript + Vite

> Part of the **fullstack-starter-pack** · React · Express · Node · PostgreSQL

A production-ready frontend starter built on React 19, Vite 8, and TypeScript — pre-configured with styling, UI components, routing, data fetching, form validation, and developer tooling so you can skip boilerplate and start building immediately.

---

## ✨ Tech Stack

### Core

| Library | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | ^19 | UI framework |
| [TypeScript](https://www.typescriptlang.org) | ~6.0 | Type safety |
| [Vite](https://vite.dev) | ^8 | Dev server & bundler |

### Styling

| Library | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Utility-first CSS framework |
| [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite) | ^4 | Vite-native Tailwind plugin (no PostCSS needed) |
| [`tw-animate-css`](https://github.com/jamiebuilds/tw-animate-css) | ^1 | Animation utilities for Tailwind |
| [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) | ^3 | Merge Tailwind classes without conflicts |
| [`class-variance-authority`](https://cva.style) | ^0.7 | Type-safe variant styles for components |
| [`clsx`](https://github.com/lukeed/clsx) | ^2 | Conditional class name builder |

### UI Components

| Library | Version | Purpose |
|---|---|---|
| [shadcn/ui](https://ui.shadcn.com) | ^4 | Copy-paste component system (CLI) |
| [`@base-ui/react`](https://base-ui.com) | ^1.7 | Headless, accessible UI primitives |
| [`lucide-react`](https://lucide.dev) | ^1 | Icon library |

### Routing

| Library | Version | Purpose |
|---|---|---|
| [`react-router-dom`](https://reactrouter.com) | ^7 | Client-side routing |

### Data Fetching & API

| Library | Version | Purpose |
|---|---|---|
| [`@tanstack/react-query`](https://tanstack.com/query) | ^5 | Async state management & caching |
| [`axios`](https://axios-http.com) | ^1 | HTTP client |

### Forms & Validation

| Library | Version | Purpose |
|---|---|---|
| [`react-hook-form`](https://react-hook-form.com) | ^7 | Performant form management |
| [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers) | ^5 | Adapter to plug validators into RHF |
| [`zod`](https://zod.dev) | ^4 | TypeScript-first schema validation |

### Fonts

| Library | Version | Purpose |
|---|---|---|
| [`@fontsource-variable/oxanium`](https://fontsource.org/fonts/oxanium) | ^5 | Self-hosted variable font (Oxanium) |

### Developer Tooling

| Tool | Version | Purpose |
|---|---|---|
| [ESLint](https://eslint.org) | ^10 | Linting |
| [`typescript-eslint`](https://typescript-eslint.io) | ^8 | TypeScript-aware lint rules |
| [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) | ^7 | Enforce hooks rules |
| [`eslint-plugin-react-refresh`](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) | ^0.5 | Validate HMR-safe exports |
| [`babel-plugin-react-compiler`](https://react.dev/learn/react-compiler) | ^1 | React Compiler (auto-memoization) |
| [`@rolldown/plugin-babel`](https://github.com/nicolo-ribaudo/rolldown-plugin-babel) | ^0.2 | Babel integration for Vite/Rolldown |

---

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets served as-is
├── src/
│   ├── assets/              # Images, SVGs, and other imported assets
│   ├── components/
│   │   └── ui/              # shadcn/ui components (added via CLI)
│   ├── lib/
│   │   └── utils.ts         # `cn()` utility (clsx + tailwind-merge)
│   ├── App.tsx              # Root app component
│   ├── main.tsx             # Entry point
│   └── global.css           # Tailwind base + CSS design tokens
├── components.json          # shadcn/ui configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.app.json        # TypeScript config for src/
├── tsconfig.node.json       # TypeScript config for vite.config.ts
└── package.json
```

> **Note:** The `src/hooks/`, `src/pages/`, `src/context/`, `src/types/`, and `src/services/` directories are not created yet — add them as your app grows. Path aliases (`#hooks/*` etc.) are already configured and ready to use.

---

## 📐 Path Aliases

The following import aliases are pre-configured in `package.json` (Node.js `imports` map):

| Alias | Resolves to |
|---|---|
| `#components/*` | `./src/components/*.tsx` |
| `#lib/*` | `./src/lib/*.ts` |
| `#hooks/*` | `./src/hooks/*.ts` |

**Usage:**
```ts
import { Button } from '#components/ui/button'
import { cn } from '#lib/utils'
import { useAuth } from '#hooks/useAuth'
```

> **TODO:** Add `paths` to `tsconfig.app.json` and `vite-tsconfig-paths` to `vite.config.ts` for full IDE + bundler resolution.

---

## 🚀 Getting Started

### Option A — Use as a GitHub Template

1. Click **"Use this template"** on the repository page
2. Create your new repository
3. Clone it locally:
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>/frontend
   ```

### Option B — Clone directly

```bash
git clone https://github.com/Soumyodeep-Das/fullstack-starter-pack.git
cd fullstack-starter-pack/frontend
```

---

## 📦 Installation

This project uses [Bun](https://bun.sh) as the package manager. Make sure it's installed:

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

Then install dependencies:

```bash
bun install
```

---

## 🧑‍💻 Development

```bash
bun run dev
```

Opens the app at `http://localhost:5173` with Hot Module Replacement (HMR).

---

## 🏗️ Build

```bash
bun run build
```

Outputs a production bundle to `dist/`. Runs `tsc -b` first for type checking.

---

## 👁️ Preview Production Build

```bash
bun run preview
```

Serves the `dist/` folder locally to verify the production build.

---

## 🧹 Lint

```bash
bun run lint
```

---

## 🎨 Adding shadcn/ui Components

Components are added via the shadcn CLI — they are copied directly into your `src/components/ui/` folder so you own the code.

```bash
# Add a single component
bunx shadcn add button

# Add multiple at once
bunx shadcn add input label form card dialog toast
```

See the full component list at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

---

## 🔤 React Compiler

The [React Compiler](https://react.dev/learn/react-compiler) is enabled via Babel. It automatically applies memoization (`useMemo`, `useCallback`, `memo`) at build time — you write plain React code and the compiler optimizes it.

> **Note:** This may slightly increase dev server startup and build times.

---

## ⚙️ Expanding ESLint (Recommended)

Upgrade to type-aware lint rules for a production app. In `eslint.config.js`, replace `tseslint.configs.recommended` with:

```js
tseslint.configs.recommendedTypeChecked,
// or for stricter rules:
tseslint.configs.strictTypeChecked,
// optionally add stylistic rules:
tseslint.configs.stylisticTypeChecked,
```

And add `parserOptions`:

```js
languageOptions: {
  parserOptions: {
    project: ['./tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: import.meta.dirname,
  },
},
```

---

## 🔗 Related

- [Backend README](../backend/README.md) — Express + Node + PostgreSQL API
- [Root README](../README.md) — Full-stack setup & running both services together
