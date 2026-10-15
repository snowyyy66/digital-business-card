# Digital business card API

A small portfolio backend for a recent college graduate starting a fullstack development career. It serves one profile and its related skills, experience, and projects through GraphQL. The checked-in profile is **illustrative TODO data**, not a claim about a real person. Its experience list is intentionally empty; no employer or commercial work history is invented.

## Requirements

- Docker Engine with Docker Compose for the one-command setup.
- Node.js 22 and pnpm 11 for running scripts outside containers.

## Start and stop

From the repository root:

```sh
docker compose up --build
```

Compose starts PostgreSQL, waits for its health check, then starts the API. Before listening, the API applies the checked-in Prisma migration and reruns the idempotent demo seed. PostgreSQL data lives in the `postgres_data` named volume. The API maps to port 3000 and PostgreSQL to port 5432 by default; set `API_PORT` or `POSTGRES_PORT` in your environment if those host ports are occupied. The Compose defaults use local demo database credentials. Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` in the environment to change them.

Open [Apollo Sandbox](http://localhost:3000/graphql) after startup. To stop the stack, press Ctrl+C or run `docker compose down` from another terminal. `docker compose down` keeps the database volume; `docker compose down -v` removes the volume and its data.

## Query the profile

Run this in Apollo Sandbox:

```graphql
query {
  profile {
    name
    description
    links
    skills { name }
    experience { company position period achievements }
    projects { name description url }
  }
}
```

You can check the running endpoint without extra dependencies:

```sh
pnpm smoke
```

The smoke script uses Node's built-in `fetch` and exits with an error if the request fails, GraphQL returns errors, the profile is missing, or any related collection is missing. If `API_PORT` differs from 3000, set `GRAPHQL_URL` to the matching `/graphql` URL before running it.

## Architecture

`src/profile/profile.resolver.ts` exposes the GraphQL query and delegates to `ProfileService`. The service reads the profile and its relations in one Prisma query, with stable ordering for the nested collections. `PrismaService` owns the database client lifecycle. PostgreSQL stores the data; Prisma migrations define the schema. The container entrypoint in `scripts/start-container.sh` runs migration, seed, then the compiled Nest application. A failed migration or seed stops startup.

## Replace the demo data

The seeded profile belongs to Vadim and links to his public GitHub profile. It includes three projects and skills taken from their repository documentation. The experience list is empty because no work history was provided. Update `prisma/seed.ts` when the profile details change; the seed targets one `demo-profile` record and replaces its related collections on rerun, so restart the API to apply updates.

## Local development and checks

With a PostgreSQL server available, copy `.env.example` to `.env` and set `DATABASE_URL` for that server. Then run:

```sh
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm start:dev
```

Run the unit suite and compile the application with:

```sh
pnpm test
pnpm build
```

## Deployment notes

Provide a PostgreSQL database and set `DATABASE_URL` and `PORT` in the API environment. Run `pnpm prisma:migrate` before serving traffic. This project also runs `pnpm prisma:seed` on container startup; replace the demo content and decide whether automatic reseeding fits your deployment before using it with real profile data. Configure credentials, TLS, and the public address for your hosting environment. No hosted deployment is included.
