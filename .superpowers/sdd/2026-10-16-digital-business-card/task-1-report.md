# Task 1 report: persistence and seed

Implemented the PostgreSQL Prisma schema and initial migration, Prisma lifecycle module/service, deterministic upsert seed, project configuration, and focused seed test. The seed uses a TODO demo identity, three explicitly example skills, one explicitly example project, no links, and zero experiences. Repeated upserts replace related rows to keep the relation counts fixed.

## Verification

- Install: `pnpm install --fetch-timeout 300000 --network-concurrency 1 --fetch-retries 1` downloaded dependencies after the default timeout had failed on the Prisma archive. Prisma/esbuild build scripts were selectively approved; nonessential optional package scripts (`@apollo/protobufjs`, `@parcel/watcher`, `unrs-resolver`) remain disabled in `pnpm-workspace.yaml`.
- TDD test: `src/profile/profile-seed.spec.ts` was written before implementation. A RED run was not observed because the initial project had no package manifest and dependency installation later failed. The test's in-memory relation handler now applies nested `deleteMany` and `create` operations to accumulated rows. After two seed invocations, it asserts one profile and exactly one of each of the three skills and the project, zero experiences, and clearly marked example/TODO values.
- GREEN: `pnpm test -- src/profile/profile-seed.spec.ts` passed (1 suite, 1 test).
- Full Jest suite and Nest build: not run here; Task 2 is handling those project-wide checks.
- Migration: Prisma CLI `migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` succeeded. The checked-in PostgreSQL migration matches the generated schema. It was not applied because Docker/PostgreSQL are unavailable.
- `git diff --check`: passed for tracked changes before commit.

## Commit

Latest Task 1 commit: `a0a9beb0ba707278326893324e7a1d9e830b80c5` (`chore: lock backend dependencies and migration`). Earlier Task 1 commits: `52df8cdf46e6af64b0259379d526e5ddb8e7dc8b` (seed test correction), `a41c7f6af6de144d7092e5659e5b0c3daadf6e8a` (persistence and seed).
