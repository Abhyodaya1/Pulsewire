# ADR-001: Monorepo Structure & Package Boundary Invariants

## Status
Accepted

## Context & Product Promise
> "Install one SDK and inspect a running React Native app from inside the app and from a web dashboard, with an AI layer that explains what happened."

Core v1 signal types:
1. Network (fetch/xhr/axios)
2. Console & Logs (log/warn/error)
3. Navigation (route transitions, screen params)
4. Device & Runtime metadata

## Explicit Non-Goals (v1)
- [ ] No crash symbolication (leave native crash traces to Sentry/Crashlytics)
- [ ] No full video session replay (privacy nightmare + payload bloat)
- [ ] No remote arbitrary JS code execution from dashboard
- [ ] No default production telemetry (strictly opt-in / developer-mode primary)

## Package Topology & Invariants

| Package / App | Runtime | Allowed Dependencies | Forbidden Dependencies |
| :--- | :--- | :--- | :--- |
| `packages/protocol` | Universal | None (Zero deps) | Node/DOM/RN APIs |
| `packages/sdk` | React Native (Hermes/JSC) | `protocol`, RN peer deps | Node built-ins, DB clients, Next.js |
| `apps/api` | Node.js (Fastify) | `protocol`, Fastify, Prisma | RN SDK, DOM APIs |
| `apps/worker` | Node.js | `protocol`, BullMQ, Prisma | RN SDK, Next.js |
| `apps/dashboard` | Browser / Node (Next.js) | `protocol`, Tailwind, React | RN SDK |
| `apps/demo-rn` | React Native | `sdk`, `protocol` | Server internals |

## Consequences
### Positive Consequences
1. **Zero Runtime Bundle Pollution:** The mobile SDK cannot accidentally import server ORMs or Node built-in APIs (`fs`, `crypto`, `child_process`) due to pnpm's strict non-hoisting isolation.
2. **Single Source of Truth for Wire Protocol:** When wire contracts change in `packages/protocol`, the compiler flags mismatches simultaneously across the Fastify API, BullMQ worker, Next.js dashboard, and React Native SDK.
3. **Independent CI Verification:** Each package and app can be linted, tested, and typechecked in parallel without cross-contaminating cache layers.

### Negative Consequences & Mitigations
1. **React Native / Metro Symlink Resolution:** React Native's Metro bundler does not automatically follow pnpm workspace symlinks out of the box. *Mitigation:* We will configure `apps/demo-rn/metro.config.js` with `watchFolders` pointing to the workspace root.
2. **Monorepo Versioning Coordination:** Managing multiple `package.json` manifests requires disciplined version bumping and `workspace:*` dependency pinning.