# Task 1 report: persistence and seed

Implemented the PostgreSQL Prisma schema and initial migration, Prisma lifecycle module/service, deterministic upsert seed, project configuration, and focused seed test. The seed uses a TODO demo identity, three explicitly example skills, one explicitly example project, no links, and zero experiences. Repeated upserts replace related rows to keep the relation counts fixed.

## Verification

- TDD test: `src/profile/profile-seed.spec.ts` was written first. The first attempted focused command could not start because no package manifest existed yet. After adding project configuration, pnpm repeatedly failed while fetching the Prisma tarball (`GET .../@prisma/client/-/client-6.19.3.tgz error (23)`). Direct Node fetch of both Prisma archives succeeded, but adding them to pnpm's store did not satisfy the lock integrity; offline installation reported `ERR_PNPM_NO_OFFLINE_TARBALL`. Further install attempts were stopped.
- RED/GREEN: not observed; the focused Jest test could not run because dependencies did not install. The test asserts one profile, three skills, one project, zero experiences, and clearly marked example/TODO values after two seed invocations.
- Full Jest suite and Nest build: not run; required dependencies are unavailable.
- Migration: initial PostgreSQL migration SQL is checked in. It could not be generated or applied with Prisma CLI because dependency installation failed; Docker/PostgreSQL are unavailable in this environment.
- `git diff --check`: passed for tracked changes before commit.

## Commit

`3355b749afc9fc0559c8add637337c6304c020e0` (`feat: add profile persistence and demo seed`).
