# Prisma Schema And Data Layer

## Goal

Prisma is already installed. Add the project data models, Prisma client singleton, and first migration.

## Models

Create `prisma/models/project.prisma`.

Add `Project`:

- owner ID mapped to Clerk user
- name
- optional description
- status enum: `DRAFT`, `ARCHIVED`
- `canvasJsonPath` for future canvas blob storage
- timestamps
- indexes on owner ID and creation date

Canonical identifier

- `id`: String — canonical project identifier. Use a UUID string and generate on the server: `id String @id @default(uuid())` in Prisma. API routes should treat this as the canonical project ID. Client-supplied IDs should generally be rejected; if a client-provided ID is accepted for room alignment it must be validated (UUID format), collision-checked, and documented in the API contract. Implementations MUST NOT invent alternate identifier schemes for the same Project entity.

Add `ProjectCollaborator`:

- project relation with cascade delete
- collaborator email
- creation timestamp
- unique constraint on project/email
- indexes on email and project/date

Do not add extra fields unless required by Prisma.

## Prisma Client

Create `lib/prisma.ts` as a cached singleton.

Branch by `DATABASE_URL`:

- if it starts with `prisma+postgres://`, use Accelerate
- otherwise use direct `@prisma/adapter-pg`

Cache the client on `global` in development for hot reloads.

## Migration

Run the migration and generate the client.

## Dependencies

Already installed:

- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

## Check When Done

- schema has both models with correct relations and indexes
- `lib/prisma.ts` exports one cached Prisma instance
- migration runs successfully
- `npm run build` passes
