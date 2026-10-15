# Digital Business Card Backend — Design

## Goal

Create a clean, demonstrable backend portfolio for a recent college graduate starting a fullstack development career. It must start from a fresh checkout with Docker and expose the profile and related portfolio data through GraphQL.

## Audience and content

The audience is a technical interviewer reviewing engineering decisions and changing the solution live. The profile should present its owner as a junior fullstack developer, recently graduated from college, with no commercial experience yet. The owner has not supplied a name, links, exact skills, or projects; seed content must make every illustrative value obvious and easy to replace, and must not invent employment history or credentials.

## Recommended approach

Use NestJS with TypeScript, Apollo GraphQL, Prisma, and PostgreSQL. Docker Compose runs the API and database. This produces a realistic backend stack while making the first-run path reproducible. Apollo Sandbox is available at the GraphQL endpoint.

Alternatives considered: SQLite makes local setup simpler but is less representative of a deployed backend; an external hosted database adds setup and credentials before the reviewer can run the project. PostgreSQL in Compose is the best fit for both the task and a live interview.

## Architecture and data flow

- GraphQL resolver: maps the `profile` query to an application service and GraphQL object types.
- Profile service: owns profile retrieval and keeps persistence details out of resolvers.
- Prisma service: owns the Prisma client lifecycle and database access.
- Prisma schema: models one profile with related skills, work experiences, and projects.
- Startup: Docker Compose starts PostgreSQL and the API; the API waits for database readiness, applies checked-in migrations, idempotently seeds the demo profile, then listens for requests.
- Configuration: environment variables have documented defaults suitable for Compose; secrets are not committed.

The `profile` query returns the profile and its nested skills, experience, and projects in a bounded Prisma query, avoiding per-field database lookups. Collections use stable ordering. A missing profile is represented as `null`.

## Data model

- `Profile`: name, short description, optional professional links.
- `Skill`: name, optional category and level, related profile.
- `Experience`: company, position, period, achievements, related profile. Empty experience is valid for an entry-level candidate.
- `Project`: name, description, optional URL, related profile.

The seed is deterministic and safe to rerun. It includes an explicit demo identity and example portfolio entries marked for replacement, an honest entry-level description, and no fabricated employer or employment record. README instructions explain how to replace the seed content before sharing the project.

## API

Expose `profile: Profile` as the primary read query, with fields for name, description, links, skills, experience, and projects. Enable Apollo Sandbox at `/graphql`. The README includes an executable example equivalent to:

```graphql
query {
  profile {
    name
    description
    skills { name }
    experience { company position period achievements }
    projects { name url }
  }
}
```

## Operations and delivery

- `docker compose up --build` is the documented clean-start command.
- A database health check gates API startup; migrations and seed run automatically on API startup.
- Include a `.env.example`, Dockerfile, Compose file, Prisma migration, and a README covering architecture, API, startup, data customization, and deployment notes.
- Git history should contain coherent project setup and implementation commits. Do not claim a hosted URL until a deployment target and credentials exist.

## Acceptance criteria

1. The project uses Git, TypeScript, Node.js, NestJS, Prisma, GraphQL, and Docker.
2. A reviewer can start the database and API from a clean checkout with one documented Compose command.
3. Startup prepares the schema and seeds profile data without manual database steps.
4. Apollo Sandbox can execute the nested profile query and return the profile, skills, experience, and projects.
5. Related collections are fetched efficiently through Prisma rather than one database query per nested object.
6. The structure separates GraphQL transport, business logic, and persistence.
7. Seed values that were not supplied by the owner are clearly identified as examples/TODOs; no employment history is fabricated.
8. README gives enough context to review the architecture and replace demo data before public sharing.

## Out of scope

Authentication, profile editing mutations, admin UI, and an actual public deployment. These are not required to demonstrate the requested read API and would add setup or operational assumptions.
