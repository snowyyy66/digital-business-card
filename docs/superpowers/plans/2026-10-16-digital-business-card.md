# Digital Business Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a runnable Dockerized NestJS/GraphQL portfolio backend with honest, replaceable demo profile data.

**Architecture:** NestJS exposes Apollo GraphQL and delegates `profile` to a service; the service loads one Prisma graph query. PostgreSQL runs in Compose. The API applies migrations and upserts a deterministic demo profile before listening.

**Tech Stack:** TypeScript, Node.js, NestJS, Apollo GraphQL, Prisma, PostgreSQL, Docker Compose, Jest.

**Spec:** `docs/superpowers/specs/2026-10-16-digital-business-card-design.md`

## Global Constraints

- Use Git, TypeScript, Node.js, NestJS, Prisma, GraphQL, and Docker.
- Do not claim experience, identity details, links, or projects the owner did not provide; clearly mark illustrative seed content.
- Keep GraphQL resolvers thin and fetch nested data without per-item database lookups.
- `docker compose up --build` must be the clean-start path and automatically prepare and seed the database.
- Apollo Sandbox must be reachable at `/graphql`.

## Review Focus

- Rerunning seed does not duplicate profile rows or relations.
- Empty work experience remains a valid profile response.
- Profile name/description and optional links with placeholder values remain clearly replaceable.
- Prisma client shuts down cleanly when the Nest application closes.
- API startup waits for PostgreSQL readiness and surfaces migration failures instead of silently serving empty data.

---

### Task 1: Persistence and seed data

**Files:**
- Create: `package.json`, `tsconfig.json`, `nest-cli.json`, `.gitignore`, `.env.example`
- Create: `prisma/schema.prisma`, `prisma/migrations/**`, `prisma/seed.ts`
- Create: `src/prisma/prisma.module.ts`, `src/prisma/prisma.service.ts`
- Test: `src/profile/profile-seed.spec.ts`

**Interfaces:**
- Produces Prisma models `Profile`, `Skill`, `Experience`, and `Project`; the seed exports `seedProfile(prisma)` and can run repeatedly.
- Produces `PrismaService extends PrismaClient` with Nest lifecycle connection/disconnection.

- [ ] Write a seed test proving repeated seed execution leaves exactly one demo profile and expected related collection counts.
- [ ] Run the focused Jest test and confirm it fails because persistence/seed does not exist.
- [ ] Implement Prisma schema and deterministic upsert-based seed. Use no fake employer; educational timeline/achievements reflect recent graduation and no commercial experience. Example skill/project values must be labelled demo/TODO.
- [ ] Run the focused test and confirm the idempotency assertion passes.
- [ ] Generate and check in the initial PostgreSQL migration; run the full test suite.
- [ ] Commit as `feat: add profile persistence and demo seed`.

### Task 2: GraphQL API and business service

**Files:**
- Create: `src/main.ts`, `src/app.module.ts`
- Create: `src/profile/profile.module.ts`, `src/profile/profile.service.ts`, `src/profile/profile.resolver.ts`, `src/profile/profile.models.ts`
- Test: `src/profile/profile.service.spec.ts`, `src/profile/profile.resolver.spec.ts`

**Interfaces:**
- Consumes: Task 1 Prisma models and `PrismaService`.
- Produces: GraphQL `Query.profile: Profile`, where `Profile` includes name, description, links, skills, experience, and projects; ProfileService returns the nested relations with a single Prisma `findFirst` including stable ordering or null when absent.

- [ ] Write service tests for the nested include query and the missing-profile null case; write resolver test proving delegation to ProfileService.
- [ ] Run the focused tests and confirm they fail for missing API behavior.
- [ ] Implement GraphQL object types, thin resolver, service, Apollo module, and `/graphql` Sandbox configuration.
- [ ] Run the focused tests, then the full Jest suite and Nest build.
- [ ] Commit as `feat: expose profile through nested graphql query`.

### Task 3: Docker startup, smoke verification, and documentation

**Files:**
- Create: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- Create: `scripts/start.sh` (or equivalent cross-platform container entrypoint)
- Create: `README.md`
- Modify: package scripts and environment configuration as needed.

**Interfaces:**
- Consumes: Tasks 1–2 API, migration, seed, and GraphQL query.
- Produces: `docker compose up --build` starts PostgreSQL, applies migrations, seeds data, and serves GraphQL; README documents setup, architecture, query, replacing demo data, and deployment requirements.

- [ ] Add a smoke verification script or documented commands that query the running GraphQL endpoint and assert nested collections are returned.
- [ ] Run the smoke check before Docker integration exists and confirm it fails because the service is unavailable.
- [ ] Implement health-gated Compose startup and API entrypoint that fails fast on migration/seed errors.
- [ ] Run `docker compose up --build` from a fresh database volume, execute the nested query, and confirm Apollo Sandbox loads.
- [ ] Restart the stack and confirm the seed stays idempotent; run the full unit suite and build.
- [ ] Commit as `feat: add dockerized startup and project guide`.

