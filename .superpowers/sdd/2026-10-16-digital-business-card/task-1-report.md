# Task 1 report: persistence and seed

Implemented the PostgreSQL Prisma schema and initial migration, Prisma lifecycle module/service, deterministic upsert seed, project configuration, and focused seed test. The seed uses a TODO demo identity, three explicitly example skills, one explicitly example project, no links, and zero experiences. Repeated upserts replace related rows to keep the relation counts fixed.

## Verification

- TDD test: `src/profile/profile-seed.spec.ts` was written first. The first attempted focused command could not start because no package manifest existed yet. After adding project configuration, pnpm repeatedly failed while fetching the Prisma tarball (`GET .../@prisma/client/-/client-6.19.3.tgz error (23)`). Direct Node fetch of both Prisma archives succeeded, but adding them to pnpm's store did not satisfy the lock integrity; offline installation reported `ERR_PNPM_NO_OFFLINE_TARBALL`. Further install attempts were stopped.
- RED/GREEN: not observed; the focused Jest test could not run because dependencies did not install. The test's in-memory relation handler now applies nested `deleteMany` and `create` operations to accumulated rows. After two seed invocations, it asserts one profile and exactly one of each of the three skills and the project, zero experiences, and clearly marked example/TODO values.
- Full Jest suite and Nest build: not run; required dependencies are unavailable.
- Migration: initial PostgreSQL migration SQL is checked in. It could not be generated or applied with Prisma CLI because dependency installation failed; Docker/PostgreSQL are unavailable in this environment.
- `git diff --check`: passed for tracked changes before commit.

## Commit

`52df8cdf46e6af64b0259379d526e5ddb8e7dc8b` (`test: verify seed relation replacement behavior`), following `a41c7f6af6de144d7092e5659e5b0c3daadf6e8a` (`feat: add profile persistence and demo seed`).
